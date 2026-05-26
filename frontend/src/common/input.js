const Input = ({ label, value, onChange, type, id, required }) => (
  <div className="mt-3">
    <label htmlFor={id} className="form-label">
      {label}
    </label>
    <input
      type={type}
      name={id}
      id={id}
      className="form-input"
      placeholder={label}
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default Input;