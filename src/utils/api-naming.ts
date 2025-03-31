
import { pluralize, singularize } from './string-utils';

export const generateApiId = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
};

export const generateApiPlural = (apiId: string): string => {
  return pluralize(apiId);
};

export const generateApiSingular = (apiId: string): string => {
  return singularize(apiId);
};

export const validateApiId = (apiId: string): boolean => {
  const validPattern = /^[a-z][a-z0-9_]*$/;
  return validPattern.test(apiId);
};
