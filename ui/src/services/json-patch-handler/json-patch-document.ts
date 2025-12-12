import { UseFormReturnType } from "@mantine/form";

export enum JsonPatchOperationType {
  Add = "add",
  Replace = "replace",
  Move = "move",
  Test = "test",
  Remove = "remove",
}

type JsonPatchOperation = {
  op: JsonPatchOperationType;
  path: string;
  value: string | Uint8Array | number[] | object;
};

export interface JsonPatchKeyValuePair {
  path: string;
  value: string | Uint8Array | number[] | object;
}

function addOperations(
  patchList: JsonPatchKeyValuePair[]
): JsonPatchOperation[] {
  const operationList: JsonPatchOperation[] = [];
  patchList.forEach((x) => {
    operationList.push({
      op: JsonPatchOperationType.Replace,
      path: `/${x.path}`,
      value: x.value,
    });
  });
  return operationList;
}

function transformDocumentToJson(operationList: JsonPatchOperation[]) {
  const operationBody = operationList;
  return operationBody;
}

export function createJsonPatchDocument(patchList: JsonPatchKeyValuePair[]) {
  const operationList = addOperations(patchList);
  const operationBody = transformDocumentToJson(operationList);
  return operationBody;
}

export function createJsonPatchRecord() {
  const jsonPatchRecord: Record<string, JsonPatchOperation[]> = {};
  return jsonPatchRecord;
}

export function addOperationToJsonPatchRecord(
  record: Record<string, JsonPatchOperation[]>,
  key: string,
  values: JsonPatchKeyValuePair
) {
  let valueToStore = values.value;

  if (values.value instanceof Uint8Array) {
    valueToStore = btoa(String.fromCharCode(...values.value)); // Uint8Array -> Base64
  }

  if (record[key] && record[key].length > 0) {
    record[key].push({
      op: JsonPatchOperationType.Replace,
      path: `/${values.path}`,
      value: valueToStore,
    });
    return;
  }

  record[key] = [
    {
      op: JsonPatchOperationType.Replace,
      path: `/${values.path}`,
      value: valueToStore,
    },
  ];
}

function isDate(value: unknown): value is Date {
  return value instanceof Date;
}

export function createJsonPatchDocumentFromDirtyForm<
  T extends Record<string, unknown>
>(
  form: UseFormReturnType<T>,
  obj: T,
  ignoredObject: Array<keyof T & string> = []
) {
  const jsonPatchList: JsonPatchKeyValuePair[] = [];

  for (const property of Object.keys(obj) as Array<keyof T & string>) {
    if (ignoredObject.includes(property)) continue;
    if (!form.isDirty(property)) continue;

    const value = obj[property]; // value: unknown

    jsonPatchList.push({
      path: property,
      value: isDate(value) ? value.toISOString() : String(value),
    });
  }

  return createJsonPatchDocument(jsonPatchList);
}

export function createJsonPatchDocumentFromList<T>(
  obj: T
): JsonPatchKeyValuePair[] {
  const jsonPatchList: JsonPatchKeyValuePair[] = [];

  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      Object.entries(item).forEach(([key, value]) => {
        jsonPatchList.push({
          path: `/UpdateAppointmentDayDtos/${item.id}/${key}`,
          value: value as object,
        });
      });
    });
  }

  return jsonPatchList;
}

/** Patch isteği atılacak form ve form.values objesi verildikten sonra patch gönderilmesi istenmeyen
 * property değerleri list of olarak içine verilerek kullanılır.
 *
 * @param form - Mantine useForm hook'undan oluşan object
 * @param obj - Patch isteği oluşturulacak değerleri içeren object
 */
// export function createJsonPatchDocumentFromDirtyFormWithDates<T>(
//   form: UseFormReturnType<T>,
//   obj: T
// ): JsonPatchKeyValuePair[] {
//   const jsonPatchList: JsonPatchKeyValuePair[] = [];

//   let property: keyof typeof obj;

//   // TODO: Use of Object.keys & Object.values for generic objects

//   for (property in obj) {
//     if (form.isDirty(property)) {
//       const propertyValue = obj[property];

//       if (propertyValue instanceof Date) {
//         jsonPatchList.push({
//           path: property,
//           value: propertyValue.toISOString(),
//         });

//         continue;
//       }

//       jsonPatchList.push({ path: property, value: String(obj[property]) });
//     }
//   }

//   return createJsonPatchDocument(jsonPatchList);
// }

/** Patch isteği atılacak form ve değelerin objesi verildikten sonra patch gönderilmesi istenmeyen
 * property değerleri list of olarak içine verilerek kullanılır.
 *
 * @param form - Mantine form objesi
 * @param obj - Patch isteği oluşturulacak obje
 * @param excludedPropertyList - Gönderilmesi istenmeyen property listesi, örneğin ["id", "isActive"]
 */
export function createJsonPatchDocumentFromDirtyFormWithExceptions<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<string, any>
>(
  form: UseFormReturnType<T>,
  obj: T,
  excludedPropertyList: Array<keyof T & string>
): JsonPatchOperation[] {
  const jsonPatchList: JsonPatchKeyValuePair[] = [];

  for (const property of Object.keys(obj) as Array<keyof T & string>) {
    if (excludedPropertyList.includes(property)) continue;

    if (form.isDirty(property)) {
      jsonPatchList.push({ path: property, value: String(obj[property]) });
    }
  }

  return createJsonPatchDocument(jsonPatchList);
}
