import Loader from "./loader";

const FormButton = ({ name, loader }) => (
  <button
    type="submit"
    className="btn-primary w-full mt-2 py-3 rounded-lg text-base"
  >
    {loader ? <Loader height={5} width={5} /> : name}
  </button>
);

export default FormButton;