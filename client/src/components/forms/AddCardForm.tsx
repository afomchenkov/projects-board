import { SubmitHandler, useForm } from "react-hook-form";
import Button from "@atlaskit/button/new";
import { TextField } from "./TextFields";
import "./AddCardForm.scss";

export type AddCardFormData = {
  name: string;
  description: string;
};

type AddCardFormInputs = {
  name: string;
  description: string;
};

type AddCardFormType = (props: {
  onFormSubmit: (data: AddCardFormData) => void;
}) => React.JSX.Element;

export const AddCardForm: AddCardFormType = ({ onFormSubmit }) => {
  const { handleSubmit, control, reset } = useForm<AddCardFormInputs>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit: SubmitHandler<AddCardFormInputs> = (
    updatedData: AddCardFormInputs
  ) => {
    onFormSubmit({ ...updatedData });
    reset();
  };

  return (
    <form className="add-card-form" onSubmit={handleSubmit(onSubmit)}>
      <TextField
        name="name"
        label="Card Name"
        control={control}
        rules={{
          required: {
            value: true,
            message: "Please specify Card Name",
          },
        }}
      />

      <TextField
        name="description"
        label="Description"
        control={control}
        rules={{
          required: {
            value: true,
            message: "Please specify description",
          },
        }}
      />

      <section className="add-card-form__submit-btn">
        <Button type="submit">Submit</Button>
      </section>
    </form>
  );
};
