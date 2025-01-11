import { Controller, Control } from "react-hook-form";
import { toDashedLowerCase } from "../../utils";
import "./Field.scss";

type CheckboxFieldProps = {
  name: string;
  label: string;
  control: Control<any>;
  rules?: Object;
};

export const CheckboxField = ({
  name,
  control,
  rules,
  label
}: CheckboxFieldProps): React.JSX.Element => {
  const componentId = toDashedLowerCase(label);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => {
        return <div className="app-board-form-group">
            <label
              className="app-board-form-label"
              htmlFor={`form-date-field-${componentId}`}
            >
              {label}
            </label>
            <input type="checkbox" {...field} checked={field.value} />
          </div>
      }}
    />
  );
};
