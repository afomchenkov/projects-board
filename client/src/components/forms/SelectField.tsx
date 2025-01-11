import { Controller, Control } from "react-hook-form";
import { toDashedLowerCase } from "../../utils";
import "./Field.scss";

type SelectFieldType = (props: {
  name: string;
  label: string;
  control: Control<any>;
  rules?: Object;
  options: { label: string; value: string }[];
}) => React.JSX.Element;

export const SelectField: SelectFieldType = ({
  name,
  label,
  control,
  rules,
  options,
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
              htmlFor={`form-select-field-${componentId}`}
            >
              {label}
            </label>
            <select
              id={`form-select-field-${componentId}`}
              className={`form-control ${hasError ? "is-invalid" : ""}`}
              {...field}
            >
              <option value="-1">Select</option>
              {options.map(({ label, value }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
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
