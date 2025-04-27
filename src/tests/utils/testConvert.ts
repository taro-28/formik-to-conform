import { convert } from "../..";
import { readFileSync } from "node:fs";
import { expect } from "vitest";

export const testConvert = async (
  formikFilepath: string,
  conformFilepath: string,
) => {
  const formikFile = readFileSync(formikFilepath, "utf-8");
  const conformFile = readFileSync(conformFilepath, "utf-8");
  const result = await convert(formikFile);
  // biome-ignore lint/suspicious/noMisplacedAssertion: <explanation>
  expect(result).toEqual(conformFile);
};
