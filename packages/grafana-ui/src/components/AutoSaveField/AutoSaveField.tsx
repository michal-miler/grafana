import { debounce } from 'lodash';
import React, { useCallback, useMemo, useRef } from 'react';

import { Field, FieldProps } from '../Forms/Field';
import { InlineToast } from '../InlineToast/InlineToast';

/**
1.- Use the Input component as a base
2.- Just save if there is any change and when it loses focus
3.- Set the loading to true while the backend is saving
4.- Be aware of the backend response. If there is an error show a proper message and return the focus to the input.
5.- Add aria-live="polite" and check how it works in a screen-reader.
Debounce instead of working with onBlur?
import debouncePromise from 'debounce-promise';
or
import { debounce} from 'lodash';
 */

export interface Props extends FieldProps {
  //Function to be run onBlur or when finishing writing
  onFinishChange: (inputValue: string | number | readonly string[] | undefined) => Promise<void>;
  saveErrorMessage?: string;
}

const SHOW_SUCCESS_DURATION = 2 * 1000;

type GenericProps<T> = Omit<Props, 'children'> & { children: (onChange: (newValue: T) => void) => React.ReactElement };

export function AutoSaveField<T = string>(props: GenericProps<T>) {
  const {
    invalid,
    loading,
    onFinishChange,
    saveErrorMessage = 'Error saving this value',
    error,
    children,
    disabled,
    ...restProps
  } = props;

  const [fieldState, setFieldState] = React.useState({
    isLoading: false,
    showSuccess: false,
    showError: invalid,
  });

  const inputRef = useRef<null | HTMLInputElement>(null);

  React.useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const time = fieldState.showError ? 0 : SHOW_SUCCESS_DURATION;
    if (fieldState.showSuccess) {
      timeoutId = setTimeout(() => {
        setFieldState({ ...fieldState, showSuccess: false });
      }, time);
    }

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [fieldState]);

  const handleChange = useCallback(
    (nextValue) => {
      if (invalid) {
        return;
      }
      setFieldState({ ...fieldState, isLoading: true, showSuccess: false });
      onFinishChange(nextValue)
        .then(() => {
          setFieldState({
            isLoading: false,
            showSuccess: true,
            showError: false,
          });
        })
        .catch(() => {
          setFieldState({
            ...fieldState,
            isLoading: false,
            showError: true,
          });
        });
    },
    [invalid, fieldState, onFinishChange]
  );

  const lodashDebounce = useMemo(() => debounce(handleChange, 600, { leading: false }), [handleChange]);

  /**
   * use Field around input to pass the error message
   * use InlineToast.tsx to show the save message
   */
  return (
    <>
      <Field
        {...restProps}
        loading={loading || fieldState.isLoading}
        invalid={invalid || fieldState.showError}
        error={error || (fieldState.showError && saveErrorMessage)}
      >
        <div ref={inputRef}>
          {React.cloneElement(
            children((newValue) => {
              lodashDebounce(newValue);
            }),
            {
              loading: loading || fieldState.isLoading,
              invalid: invalid || fieldState.showError,
              disabled,
            }
          )}
        </div>
      </Field>
      {fieldState.showSuccess && (
        <InlineToast
          suffixIcon={'check'}
          referenceElement={inputRef.current}
          placement="right"
          alternativePlacement="bottom"
        >
          Saved!
        </InlineToast>
      )}
    </>
  );
}

AutoSaveField.displayName = 'AutoSaveField';
