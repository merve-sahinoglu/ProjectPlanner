import { UseFormReturnType } from "@mantine/form";

enum JsonPatchOperationType {
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

export function createJsonPatchDocumentFromDirtyForm<T>(
  form: UseFormReturnType<T>,
  obj: T,
  ignoredObject: string[] = []
): JsonPatchKeyValuePair[] {
  const jsonPatchList: JsonPatchKeyValuePair[] = [];

  let property: keyof typeof obj;

  // TODO: Use of Object.keys & Object.values for generic objects
  // eslint-disable-next-line no-restricted-syntax
  for (property in obj) {
    if (form.isDirty(property)) {
      console.log(obj[property]);
      const ignored0bj = ignoredObject.find((x) => x === property);
      if (!ignored0bj) {
        jsonPatchList.push({ path: property, value: String(obj[property]) });
      }
    }
  }
  console.log(jsonPatchList);

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
export function createJsonPatchDocumentFromDirtyFormWithDates<T>(
  form: UseFormReturnType<T>,
  obj: T
): JsonPatchKeyValuePair[] {
  const jsonPatchList: JsonPatchKeyValuePair[] = [];

  let property: keyof typeof obj;

  // TODO: Use of Object.keys & Object.values for generic objects
  // eslint-disable-next-line no-restricted-syntax
  for (property in obj) {
    if (form.isDirty(property)) {
      const propertyValue = obj[property];

      if (propertyValue instanceof Date) {
        jsonPatchList.push({
          path: property,
          value: propertyValue.toISOString(),
        });
        // eslint-disable-next-line no-continue
        continue;
      }

      jsonPatchList.push({ path: property, value: String(obj[property]) });
    }
  }

  return createJsonPatchDocument(jsonPatchList);
}

/** Patch isteği atılacak form ve değelerin objesi verildikten sonra patch gönderilmesi istenmeyen
 * property değerleri list of olarak içine verilerek kullanılır.
 *
 * @param form - Mantine form objesi
 * @param obj - Patch isteği oluşturulacak obje
 * @param excludedPropertyList - Gönderilmesi istenmeyen property listesi, örneğin ["id", "isActive"]
 */
export function createJsonPatchDocumentFromDirtyFormWithExceptions<T>(
  form: UseFormReturnType<T>,
  obj: T,
  excludedPropertyList: Array<keyof T>
): JsonPatchKeyValuePair[] {
  const jsonPatchList: JsonPatchKeyValuePair[] = [];

  let property: keyof typeof obj;

  // eslint-disable-next-line no-restricted-syntax
  for (property in obj) {
    if (excludedPropertyList.includes(property)) {
      // eslint-disable-next-line no-continue
      continue;
    }
    if (form.isDirty(property)) {
      jsonPatchList.push({ path: property, value: String(obj[property]) });
    }
  }

  return createJsonPatchDocument(jsonPatchList);
}
