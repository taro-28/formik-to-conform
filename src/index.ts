import jscodeshift, {
  type JSCodeshift,
  type JSXElement,
  type JSXIdentifier,
  type JSXNamespacedName,
  type Expression,
} from "jscodeshift";
import { format } from "prettier";

// JSX属性に関する汎用的な型定義
interface AttributeLike {
  type: string;
  name?: JSXIdentifier | JSXNamespacedName;
  value?: unknown;
}

/**
 * 文字列リテラル型であるかをチェックする型ガード
 */
function isStringLiteral(
  value: unknown,
): value is { type: "StringLiteral"; value: string } {
  return (
    value !== null &&
    typeof value === "object" &&
    "type" in value &&
    value.type === "StringLiteral"
  );
}

/**
 * JSX属性から値を安全に取り出す
 */
function getAttributeValue(
  attr: AttributeLike | null | undefined,
): string | null {
  if (!(attr && "value" in attr && attr.value)) {
    return null;
  }

  if (isStringLiteral(attr.value)) {
    return attr.value.value;
  }

  return null;
}

/**
 * 関数式であるかをチェックする型ガード
 */
function isFunctionExpression(node: unknown): node is {
  type: "ArrowFunctionExpression" | "FunctionExpression";
  body: unknown;
} {
  return (
    node !== null &&
    typeof node === "object" &&
    "type" in node &&
    ["ArrowFunctionExpression", "FunctionExpression"].includes(
      node.type as string,
    )
  );
}

/**
 * JSX式コンテナであるかをチェックする型ガード
 */
function isJSXExpressionContainer(value: unknown): value is {
  type: "JSXExpressionContainer";
  expression: { type: string } & Expression;
} {
  return (
    value !== null &&
    typeof value === "object" &&
    "type" in value &&
    value.type === "JSXExpressionContainer" &&
    "expression" in value &&
    value.expression !== null &&
    typeof value.expression === "object" &&
    "type" in value.expression
  );
}

/**
 * 要素を getInputProps 化する関数
 */
function transformToGetInputProps(
  j: JSCodeshift,
  formJSX: JSXElement,
  elementSelector: string,
  isField = false,
) {
  const elements = j(formJSX).find(j.JSXElement, {
    openingElement: { name: { name: elementSelector } },
  });

  for (const elemPath of elements.paths()) {
    const el = elemPath.node.openingElement;
    const idAttr = el.attributes?.find(
      (a) => a.type === "JSXAttribute" && a.name?.name === "id",
    );
    const nameAttr = isField
      ? el.attributes?.find(
          (a) => a.type === "JSXAttribute" && a.name?.name === "name",
        )
      : null;

    // Check for custom component via 'as' prop for Field
    const asAttr = isField
      ? el.attributes?.find(
          (a) => a.type === "JSXAttribute" && a.name?.name === "as",
        )
      : null;

    // Use name attribute value if available, otherwise fall back to id
    const fieldName = getAttributeValue(nameAttr);
    const idValue = getAttributeValue(idAttr) || fieldName || "field";

    // Collect all existing attributes to preserve
    const typeAttr = el.attributes?.find(
      (a) => a.type === "JSXAttribute" && a.name?.name === "type",
    );
    const placeholderAttr = el.attributes?.find(
      (a) => a.type === "JSXAttribute" && a.name?.name === "placeholder",
    );
    const disabledAttr = el.attributes?.find(
      (a) => a.type === "JSXAttribute" && a.name?.name === "disabled",
    );

    // Build props for getInputProps
    const getInputPropsProperties = [];

    // Handle type attribute
    if (typeAttr && typeAttr.type === "JSXAttribute" && typeAttr.value) {
      if (isStringLiteral(typeAttr.value)) {
        getInputPropsProperties.push(
          j.property(
            "init",
            j.identifier("type"),
            j.literal(typeAttr.value.value),
          ),
        );
      } else if (
        isJSXExpressionContainer(typeAttr.value) &&
        typeAttr.value.expression.type !== "JSXEmptyExpression"
      ) {
        getInputPropsProperties.push(
          j.property("init", j.identifier("type"), typeAttr.value.expression),
        );
      } else {
        getInputPropsProperties.push(
          j.property("init", j.identifier("type"), j.literal("text")),
        );
      }
    } else {
      getInputPropsProperties.push(
        j.property("init", j.identifier("type"), j.literal("text")),
      );
    }

    // Handle placeholder attribute
    if (
      placeholderAttr &&
      placeholderAttr.type === "JSXAttribute" &&
      placeholderAttr.value
    ) {
      if (isStringLiteral(placeholderAttr.value)) {
        getInputPropsProperties.push(
          j.property(
            "init",
            j.identifier("placeholder"),
            j.literal(placeholderAttr.value.value),
          ),
        );
      } else if (
        isJSXExpressionContainer(placeholderAttr.value) &&
        placeholderAttr.value.expression.type !== "JSXEmptyExpression"
      ) {
        getInputPropsProperties.push(
          j.property(
            "init",
            j.identifier("placeholder"),
            placeholderAttr.value.expression,
          ),
        );
      }
    }

    // Handle disabled attribute
    if (disabledAttr && disabledAttr.type === "JSXAttribute") {
      if (disabledAttr.value === null) {
        // <input disabled /> case
        getInputPropsProperties.push(
          j.property("init", j.identifier("disabled"), j.literal(true)),
        );
      } else if (isStringLiteral(disabledAttr.value)) {
        getInputPropsProperties.push(
          j.property(
            "init",
            j.identifier("disabled"),
            j.literal(disabledAttr.value.value === "true"),
          ),
        );
      } else if (
        isJSXExpressionContainer(disabledAttr.value) &&
        disabledAttr.value.expression.type !== "JSXEmptyExpression"
      ) {
        getInputPropsProperties.push(
          j.property(
            "init",
            j.identifier("disabled"),
            disabledAttr.value.expression,
          ),
        );
      }
    }

    const newAttrs = [
      j.jsxSpreadAttribute(
        j.callExpression(j.identifier("getInputProps"), [
          j.memberExpression(
            j.identifier("fields"),
            j.identifier(fieldName || idValue),
          ),
          j.objectExpression(getInputPropsProperties),
        ]),
      ),
      j.jsxAttribute(j.jsxIdentifier("id"), j.literal(idValue)),
    ];

    if (isField) {
      // Handle Field with custom component (as prop)
      if (asAttr && asAttr.type === "JSXAttribute" && asAttr.value) {
        let customComponentName: string;

        if (
          isJSXExpressionContainer(asAttr.value) &&
          asAttr.value.expression.type === "Identifier"
        ) {
          customComponentName = asAttr.value.expression.name;

          // Create new element with the custom component
          const customElement = j.jsxElement(
            j.jsxOpeningElement(
              j.jsxIdentifier(customComponentName),
              newAttrs,
              true,
            ),
            null,
            [],
          );
          elemPath.replace(customElement);
        } else {
          // Create new input element as fallback
          const inputElement = j.jsxElement(
            j.jsxOpeningElement(j.jsxIdentifier("input"), newAttrs, true),
            null,
            [],
          );
          elemPath.replace(inputElement);
        }
      } else {
        // Create new input element and replace Field
        const inputElement = j.jsxElement(
          j.jsxOpeningElement(j.jsxIdentifier("input"), newAttrs, true),
          null,
          [],
        );
        elemPath.replace(inputElement);
      }
    } else {
      // Update existing input's attributes
      el.attributes = newAttrs;
    }
  }
}

/**
 * Transform inputs that use Formik's useField to Conform's getInputProps
 */
function transformUseFieldInputs(
  j: JSCodeshift,
  root: ReturnType<JSCodeshift>,
) {
  const inputElements = root.find(j.JSXElement, {
    openingElement: { name: { name: "input" } },
  });

  for (const inputPath of inputElements.paths()) {
    const el = inputPath.node.openingElement;
    const jsxSpreadAttrs =
      el.attributes?.filter(
        (attr: { type: string }) => attr.type === "JSXSpreadAttribute",
      ) || [];

    // Look for inputs with {...field} spread attributes
    if (jsxSpreadAttrs.length > 0) {
      for (const spreadAttr of jsxSpreadAttrs) {
        if (
          spreadAttr.type === "JSXSpreadAttribute" &&
          spreadAttr.argument.type === "Identifier" &&
          spreadAttr.argument.name === "field"
        ) {
          // Create the getInputProps expression
          const getInputPropsSpread = j.jsxSpreadAttribute(
            j.callExpression(j.identifier("getInputProps"), [
              j.identifier("field"),
              j.objectExpression([
                j.property("init", j.identifier("type"), j.literal("text")),
              ]),
            ]),
          );

          // Replace {...field} with {...getInputProps(field, { type: "text" })}
          const newAttrs = [...(el.attributes || [])];
          const spreadIndex = newAttrs.indexOf(spreadAttr);
          newAttrs.splice(spreadIndex, 1, getInputPropsSpread);
          el.attributes = newAttrs;
        }
      }
    }
  }
}

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

  // Check if file contains useField from formik
  const formikImports = root.find(j.ImportDeclaration, {
    source: { value: "formik" },
  });

  const hasUseField =
    formikImports
      .find(j.ImportSpecifier, { imported: { name: "useField" } })
      .size() > 0;

  // Check if file contains Formik component
  const hasFormik = root.findJSXElements("Formik").size() > 0;

  // 1) Formik import を削除
  formikImports.remove();

  // 2) Conform import が無ければ追加
  if (
    root
      .find(j.ImportDeclaration, {
        source: { value: "@conform-to/react" },
      })
      .size() === 0
  ) {
    // Determine which imports are needed
    const specifiers = [j.importSpecifier(j.identifier("getInputProps"))];

    if (hasFormik) {
      specifiers.push(j.importSpecifier(j.identifier("useForm")));
    }

    if (hasUseField) {
      specifiers.push(j.importSpecifier(j.identifier("useField")));
    }

    const conformImport = j.importDeclaration(
      specifiers,
      j.literal("@conform-to/react"),
    );

    const firstImport = root.find(j.ImportDeclaration).at(0);
    firstImport.size()
      ? firstImport.insertBefore(conformImport)
      : root.get().node.program.body.unshift(conformImport);
  }

  /* ------------------ Transform useField in components ------------------ */
  // Replace instances of useField from formik to @conform-to/react
  if (hasUseField) {
    transformUseFieldInputs(j, root);
  }

  /* --------------------------- <Formik> 置き換え --------------------------- */

  for (const path of root.findJSXElements("Formik").paths()) {
    const opening = path.node.openingElement;
    const attrs = opening.attributes;
    // initialValues, onSubmit 抽出
    const initAttr = attrs?.find(
      (a) =>
        a.type === "JSXAttribute" &&
        a.name.type === "JSXIdentifier" &&
        a.name.name === "initialValues",
    );

    const defaultValueExpr =
      initAttr && initAttr.type === "JSXAttribute" && initAttr.value
        ? initAttr.value.type === "JSXExpressionContainer"
          ? initAttr.value.expression
          : null
        : null;

    // 子要素 ({ props }) => (<form … />) を取得
    const childrenFn = path.node.children?.find(
      (c) => c.type === "JSXExpressionContainer",
    )?.expression;

    if (!(childrenFn && isFunctionExpression(childrenFn))) {
      throw new Error("Invalid children function");
    }

    // <form> JSX を抽出
    let formJSX: JSXElement | null = null;

    const body = childrenFn.body;
    if (body.type === "JSXElement") {
      formJSX = body;
    } else if (body.type === "BlockStatement") {
      const ret = body.body.find(
        (s: { type: string }) => s.type === "ReturnStatement",
      );
      if (
        ret &&
        "argument" in ret &&
        ret.argument &&
        typeof ret.argument === "object"
      ) {
        formJSX = ret.argument.type === "JSXElement" ? ret.argument : null;
      }
    }

    if (!formJSX) {
      throw new Error("Invalid children function");
    }

    /* ---- form.onSubmit に差し替え ---- */
    const onSubmitAttrs = j(formJSX).find(j.JSXAttribute, {
      name: { name: "onSubmit" },
    });
    for (const attrPath of onSubmitAttrs.paths()) {
      attrPath
        .get("value")
        .replace(
          j.jsxExpressionContainer(
            j.memberExpression(j.identifier("form"), j.identifier("onSubmit")),
          ),
        );
    }

    /* ---- 要素を getInputProps 化 ---- */
    // Transform <input> elements
    transformToGetInputProps(j, formJSX, "input");

    // Transform <Field> elements
    transformToGetInputProps(j, formJSX, "Field", true);

    /* ---- useForm 宣言をコンポーネント先頭へ挿入 ---- */
    const useFormDecl = j.variableDeclaration("const", [
      j.variableDeclarator(
        j.arrayPattern([j.identifier("form"), j.identifier("fields")]),
        j.callExpression(j.identifier("useForm"), [
          j.objectExpression([
            j.property(
              "init",
              j.identifier("defaultValue"),
              defaultValueExpr &&
                (defaultValueExpr.type === "ObjectExpression" ||
                  defaultValueExpr.type === "Identifier")
                ? defaultValueExpr
                : j.objectExpression([]),
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
