import { useState, useCallback } from 'react';

interface ValidationRules {
  [key: string]: ((value: any) => boolean | string);
}

export const useFormValidation = (initialValues: Record<string, any>, rules: ValidationRules) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback(
    (fieldName: string, value: any) => {
      if (rules[fieldName]) {
        const result = rules[fieldName](value);
        if (typeof result === 'string') {
          setErrors((prev) => ({ ...prev, [fieldName]: result }));
          return false;
        }
        if (!result) {
          setErrors((prev) => ({ ...prev, [fieldName]: 'Invalid input' }));
          return false;
        }
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
      return true;
    },
    [rules]
  );

  const handleChange = useCallback(
    (fieldName: string, value: any) => {
      setValues((prev) => ({ ...prev, [fieldName]: value }));
      validate(fieldName, value);
    },
    [validate]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const validateAll = useCallback(() => {
    let isValid = true;
    const newErrors: Record<string, string> = {};

    Object.keys(rules).forEach((fieldName) => {
      const result = rules[fieldName](values[fieldName]);
      if (typeof result === 'string') {
        newErrors[fieldName] = result;
        isValid = false;
      } else if (!result) {
        newErrors[fieldName] = 'Invalid input';
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [rules, values]);

  return {
    values,
    errors,
    setValues,
    handleChange,
    reset,
    validateAll,
    setError: (fieldName: string, error: string) =>
      setErrors((prev) => ({ ...prev, [fieldName]: error })),
  };
};