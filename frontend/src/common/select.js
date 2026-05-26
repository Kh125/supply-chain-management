const Select = ({ label, value, onChange, options }) => (
  <div className="mt-3">
    <label className="form-label">{label}</label>
    <div className="relative">
      <select
        id="dropdown"
        name="dropdown"
        className="form-input appearance-none pr-10 cursor-pointer"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option, index) => (
          <option
            key={index}
            value={option}
            className="bg-surface-card text-content-primary"
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </option>
        ))}
      </select>
      {/* Chevron icon */}
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        <svg
          className="w-4 h-4 text-content-muted"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  </div>
);

export default Select;