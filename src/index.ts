import jscodeshift, { type JSCodeshift } from "jscodeshift";
import { format } from "prettier";

/**
 * Formik → Conform 変換
 * @param code 変換対象コード（.tsx を想定）
 * @returns 変換後コード
 */
export async function convert(code: string): Promise<string> {
  // TSX 用パーサで jscodeshift API を取得
  const j: JSCodeshift = jscodeshift.withParser("tsx");
  const root = j(code);

  /* ------------------------------ import 変換 ------------------------------ */

  // 1) Formik import を削除
  root.find(j.ImportDeclaration, { source: { value: "formik" } }).remove();

  // 2) Conform import が無ければ追加
  if (
    root
      .find(j.ImportDeclaration, {
        source: { value: "@conform-to/react" },
      })
      .size() === 0
  ) {
    const conformImport = j.importDeclaration(
      [
        j.importSpecifier(j.identifier("getInputProps")),
        j.importSpecifier(j.identifier("useForm")),
      ],
      j.literal("@conform-to/react"),
    );

    const firstImport = root.find(j.ImportDeclaration).at(0);
    firstImport.size()
      ? firstImport.insertBefore(conformImport)
      : root.get().node.program.body.unshift(conformImport);
  }

  /* --------------------------- <Formik> 置き換え --------------------------- */

  for (const path of root.findJSXElements("Formik").paths()) {
    const opening = path.node.openingElement;
    const attrs = opening.attributes;

    // initialValues, onSubmit 抽出
    const initAttr = attrs.find(
      (a) =>
        a.type === "JSXAttribute" && (a.name as any).name === "initialValues",
    ) as any;
    const submitAttr = attrs.find(
      (a) => a.type === "JSXAttribute" && (a.name as any).name === "onSubmit",
    ) as any;

    const defaultValueExpr = initAttr?.value
      ? (initAttr.value as any).expression
      : null;
    const onSubmitExpr = submitAttr?.value
      ? (submitAttr.value as any).expression
      : null;

    // 子要素 ({ props }) => (<form … />) を取得
    const childrenFn = path.node.children.find(
      (c) => c.type === "JSXExpressionContainer",
    )?.expression as any;
    if (
      !childrenFn ||
      !["ArrowFunctionExpression", "FunctionExpression"].includes(
        childrenFn.type,
      )
    )
      return;

    // <form> JSX を抽出
    let formJSX: any = null;
    const body = childrenFn.body;
    if (body.type === "JSXElement") {
      formJSX = body;
    } else if (body.type === "BlockStatement") {
      const ret = body.body.find((s: any) => s.type === "ReturnStatement");
      formJSX = ret?.argument;
    }
    if (!formJSX) return;

    /* ---- form.onSubmit に差し替え ---- */
    const onSubmitAttrs = j(formJSX).find(j.JSXAttribute, {
      name: { name: "onSubmit" },
    });
    for (const attrPath of onSubmitAttrs.paths()) {
      (attrPath.get("value") as any).replace(
        j.jsxExpressionContainer(
          j.memberExpression(j.identifier("form"), j.identifier("onSubmit")),
        ),
      );
    }

    /* ---- <input> を getInputProps 化 ---- */
    const inputElements = j(formJSX).find(j.JSXElement, {
      openingElement: { name: { name: "input" } },
    });
    for (const inputPath of inputElements.paths()) {
      const el = inputPath.node.openingElement;
      const idAttr = el.attributes.find(
        (a) => a.type === "JSXAttribute" && (a.name as any).name === "id",
      ) as any;
      const idValue = idAttr?.value?.value ?? "field";

      el.attributes = [
        j.jsxSpreadAttribute(
          j.callExpression(j.identifier("getInputProps"), [
            j.memberExpression(j.identifier("fields"), j.identifier(idValue)),
            j.objectExpression([
              j.property("init", j.identifier("type"), j.literal("text")),
            ]),
          ]),
        ),
        j.jsxAttribute(j.jsxIdentifier("type"), j.literal("text")),
        idAttr || j.jsxAttribute(j.jsxIdentifier("id"), j.literal(idValue)),
      ] as any;
    }

    /* ---- useForm 宣言をコンポーネント先頭へ挿入 ---- */
    const useFormDecl = j.variableDeclaration("const", [
      j.variableDeclarator(
        j.arrayPattern([j.identifier("form"), j.identifier("fields")]),
        j.callExpression(j.identifier("useForm"), [
          j.objectExpression([
            j.property(
              "init",
              j.identifier("defaultValue"),
              defaultValueExpr || j.objectExpression([]),
            ),
          ]),
        ]),
      ),
    ]);

    // 最近接の関数スコープ（= コンポーネント）へ挿入
    const funcPath = j(path).closest(j.Function, () => true);
    if (funcPath.size() > 0) {
      const funcNode = funcPath.get(0).node;
      if (funcNode.body && funcNode.body.type === "BlockStatement") {
        funcNode.body.body.unshift(useFormDecl);
      }
    }

    /* ---- <Formik> を <>…</> に置換 ---- */
    path.replace(formJSX);
  }

  /* ------------------------------ 出力 ------------------------------ */
  return await format(
    root.toSource({
      quote: "double",
      trailingComma: true,
      tabWidth: 2,
      useTabs: false,
      wrapColumn: 100,
    }),
    {
      parser: "typescript",
    },
  );
}
