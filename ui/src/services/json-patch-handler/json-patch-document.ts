import { UseFormReturnType } from '@mantine/form';

enum JsonPatchOperationType {
  Add = 'add',
  Replace = 'replace',
  Move = 'move',
  Test = 'test',
  Remove = 'remove',
}

type JsonPatchOperation = {
  op: JsonPatchOperationType;
  path: string;
  value: string;
};

export interface JsonPatchKeyValuePair {
  path: string;
  value: string;
}

function addOperations(patchList: JsonPatchKeyValuePair[]): JsonPatchOperation[] {
  const operationList: JsonPatchOperation[] = [];
  patchList.forEach(x => {
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
  if (record[key] && record[key].length > 0) {
    record[key].push({
      op: JsonPatchOperationType.Replace,
      path: `/${values.path}`,
      value: values.value,
    });
    return;
  }
  // eslint-disable-next-line no-param-reassign
  record[key] = [
    {
      op: JsonPatchOperationType.Replace,
      path: `/${values.path}`,
      value: values.value,
    },
  ];
}

export function createJsonPatchDocumentFromDirtyForm<T>(
  form: UseFormReturnType<T>,
  obj: T
): JsonPatchKeyValuePair[] {
  const jsonPatchList: JsonPatchKeyValuePair[] = [];

  let property: keyof typeof obj;

  // TODO: Use of Object.keys & Object.values for generic objects
  // eslint-disable-next-line no-restricted-syntax
  for (property in obj) {
    if (form.isDirty(property)) {
      jsonPatchList.push({ path: property, value: String(obj[property]) });
    }
  }

  return createJsonPatchDocument(jsonPatchList);
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
        jsonPatchList.push({ path: property, value: propertyValue.toISOString() });
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
