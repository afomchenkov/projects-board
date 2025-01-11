import { Controller, Control } from "react-hook-form";
import { toDashedLowerCase } from "../../utils";
import "./Field.scss";

type NumberFieldType = (props: {
  name: string;
  label: string;
  control: Control<any>;
  rules?: Object;
}) => React.JSX.Element;

export const NumberField: NumberFieldType = ({
  name,
  label,
  control,
  rules,
}) => {
  const componentId = toDashedLowerCase(label);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => {
        const hasError = Boolean(fieldState.error);

        return (
          <div className="app-board-form-group">
            <label
              className="app-board-form-label"
              htmlFor={`form-number-field-${componentId}`}
            >
              {label}
            </label>
            <input
              id={`form-number-field-${componentId}`}
              className={`form-control ${hasError ? "is-invalid" : ""}`}
              type="number"
              {...field}
            />
            {hasError && (
              <small className="app-board-text-danger">
                {fieldState?.error?.message}
              </small>
            )}
          </div>
        );
      }}
    />
  );
};
