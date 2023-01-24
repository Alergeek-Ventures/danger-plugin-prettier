// Provides dev-time type structures for  `danger` - doesn't affect runtime.
import { DangerDSLType } from "../node_modules/danger/distribution/dsl/DangerDSL";
declare var danger: DangerDSLType;
export declare function message(message: string): void;
export declare function warn(message: string): void;
export declare function fail(message: string): void;
export declare function markdown(message: string): void;

import { check, resolveConfig } from "prettier";
import { readFileSync } from "fs";

/**
 * Check if code was prettier-formatted
 */

const verifyFile = async (filePath: string) => {
  const options = await resolveConfig(filePath);
  const fileContents = readFileSync(filePath).toString();
  try {
    return check(fileContents, { ...options, filepath: filePath });
  } catch (error) {
    // skip on unrecognized file
    if (error.message.includes("No parser could be inferred for file")) {
      return true;
    } else {
      throw error;
    }
  }
};

export default async function prettier() {
  // Replace this with the code from your Dangerfile
  const filePaths = [...danger.git.created_files, ...danger.git.modified_files];

  for (let path of filePaths) {
    const isFileOkay = await verifyFile(path);
    if (!isFileOkay) {
      fail(
        `We found file (\`${path}\`) that wasn't formatted with Prettier. Check if you have husky setup properly, as this should've been done automatically.`
      );
      break;
    }
  }
}
