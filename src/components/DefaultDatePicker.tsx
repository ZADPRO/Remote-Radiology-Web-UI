import React, { useRef, useState, useEffect } from "react";
import { Calendar } from "lucide-react";

type Props = {
  value: string; // expects yyyy-mm-dd format
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
};

const DefaultDatePicker: React.FC<Props> = (props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const [displayValue, setDisplayValue] = useState("");
  const [error, setError] = useState("");
  const [_, setIsValid] = useState(true);

  // Convert yyyy-mm-dd to mm-dd-yyyy for display
  useEffect(() => {
    if (props.value) {
      const [year, month, day] = props.value.split("-");
      if (year && month && day) {
        setDisplayValue(`${month}-${day}-${year}`);
        setError("");
        setIsValid(true);
      }
    } else {
      setDisplayValue("");
      setError("");
      setIsValid(true);
    }
  }, [props.value]);

  const handleIconClick = () => {
    hiddenInputRef.current?.showPicker?.();
  };

  const validateDate = (
    month: string,
    day: string,
    year: string
  ): { isValid: boolean; error: string } => {
    // Check if we have complete values
    if (month.length !== 2 || day.length !== 2 || year.length !== 4) {
      return { isValid: false, error: "Date must be in mm-dd-yyyy format" };
    }

    const monthNum = parseInt(month, 10);
    const dayNum = parseInt(day, 10);
    const yearNum = parseInt(year, 10);

    // Check month range
    if (monthNum < 1 || monthNum > 12) {
      return { isValid: false, error: "Month must be between 01-12" };
    }

    // Check day range
    if (dayNum < 1 || dayNum > 31) {
      return { isValid: false, error: "Day must be between 01-31" };
    }

    // Check year range (reasonable range)
    if (yearNum < 1900 || yearNum > 2100) {
      return { isValid: false, error: "Year must be between 1900-2100" };
    }

    // Check if the date actually exists (e.g., Feb 31 doesn't exist)
    // const formattedValue = `${year}-${month}-${day}`;
    const date = new Date(yearNum, monthNum - 1, dayNum);
    const isValidDate =
      date instanceof Date &&
      !isNaN(date.getTime()) &&
      date.getFullYear() === yearNum &&
      date.getMonth() + 1 === monthNum &&
      date.getDate() === dayNum;

    if (!isValidDate) {
      return {
        isValid: false,
        error: "Invalid date (e.g., Feb 31 doesn't exist)",
      };
    }

    return { isValid: true, error: "" };
  };

  const handleDisplayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;

    // Remove any non-digit characters except hyphens
    inputValue = inputValue.replace(/[^\d-]/g, "");

    // Prevent multiple consecutive hyphens
    inputValue = inputValue.replace(/-+/g, "-");

    // Auto-add hyphens while typing
    const cleanValue = inputValue.replace(/-/g, "");
    if (cleanValue.length >= 2) {
      inputValue = cleanValue.slice(0, 2);
      if (cleanValue.length >= 2) {
        inputValue += "-" + cleanValue.slice(2, 4);
      }
      if (cleanValue.length >= 4) {
        inputValue += "-" + cleanValue.slice(4, 8);
      }
    }

    setDisplayValue(inputValue);

    // Check if input is empty
    if (inputValue === "") {
      setError("");
      setIsValid(true);

      // Clear custom validity
      if (inputRef.current) {
        inputRef.current.setCustomValidity("");
      }

      if (props.onChange && hiddenInputRef.current) {
        // Handle clearing the input
        hiddenInputRef.current.value = "";
        const syntheticEvent = {
          ...e,
          target: hiddenInputRef.current,
          currentTarget: hiddenInputRef.current,
        } as React.ChangeEvent<HTMLInputElement>;
        props.onChange(syntheticEvent);
      }
      return;
    }

    // Try to parse the date
    const dateRegex = /^(\d{2})-(\d{2})-(\d{4})$/;
    const match = inputValue.match(dateRegex);

    if (match) {
      // Complete date format matched
      const [, month, day, year] = match;

      const validation = validateDate(month, day, year);

      if (validation.isValid) {
        setError("");
        setIsValid(true);
        const formattedValue = `${year}-${month}-${day}`;

        if (props.onChange && hiddenInputRef.current) {
          // Update hidden input and trigger onChange
          hiddenInputRef.current.value = formattedValue;

          // Set custom validity to empty (valid)
          if (inputRef.current) {
            inputRef.current.setCustomValidity("");
          }

          const syntheticEvent = {
            ...e,
            target: hiddenInputRef.current,
            currentTarget: hiddenInputRef.current,
          } as React.ChangeEvent<HTMLInputElement>;
          props.onChange(syntheticEvent);
        }
      } else {
        setError(validation.error);
        setIsValid(false);

        // Set custom validity message to mark input as invalid
        if (inputRef.current) {
          inputRef.current.setCustomValidity(validation.error);
        }
      }
    } else {
      // Check if user has finished typing but format is wrong
      // Count hyphens to determine if they've reached expected positions
      const hyphenCount = (inputValue.match(/-/g) || []).length;

      // If we have 2 hyphens and length is between 8-10, user is done or almost done typing
      if (hyphenCount === 2 && inputValue.length >= 8) {
        // Check the pattern more loosely to give specific error
        const parts = inputValue.split("-");

        if (parts.length === 3) {
          const [month, day, year] = parts;

          // Check if year is incomplete (less than 4 digits)
          if (year && year.length < 4 && inputValue.length >= 8) {
            setError("Year must be 4 digits (e.g., 2024)");
            setIsValid(false);

            if (inputRef.current) {
              inputRef.current.setCustomValidity(
                "Year must be 4 digits (e.g., 2024)"
              );
            }
            return;
          }

          // Check if month or day is incomplete
          if (month && month.length < 2) {
            setError("Month must be 2 digits (e.g., 01-12)");
            setIsValid(false);

            if (inputRef.current) {
              inputRef.current.setCustomValidity(
                "Month must be 2 digits (e.g., 01-12)"
              );
            }
            return;
          }

          if (day && day.length < 2) {
            setError("Day must be 2 digits (e.g., 01-31)");
            setIsValid(false);

            if (inputRef.current) {
              inputRef.current.setCustomValidity(
                "Day must be 2 digits (e.g., 01-31)"
              );
            }
            return;
          }
        }

        // Generic error for malformed input
        setError("Invalid date format. Use mm-dd-yyyy");
        setIsValid(false);

        if (inputRef.current) {
          inputRef.current.setCustomValidity(
            "Invalid date format. Use mm-dd-yyyy"
          );
        }
      } else {
        // Still typing, clear errors
        setError("");
        setIsValid(true);

        if (inputRef.current) {
          inputRef.current.setCustomValidity("");
        }
      }
    }
  };

  const handleDatePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // When using the date picker, pass the event directly
    setError("");
    setIsValid(true);

    // Clear custom validity
    if (inputRef.current) {
      inputRef.current.setCustomValidity("");
    }

    if (props.onChange) {
      props.onChange(e);
    }
  };

  return (
    <div className="relative w-full">
      {/* Hidden native date input */}
      <input
        ref={hiddenInputRef}
        className="absolute opacity-0 pointer-events-none"
        type="date"
        value={props.value}
        onChange={handleDatePickerChange}
        disabled={props.disabled}
        tabIndex={-1}
      />

      {/* Wrapper for input and icon only */}
      <div className="relative">
        {/* Visible text input */}
        <input
          ref={inputRef}
          className={`w-full font-normal bg-background px-3 py-2 rounded-md text-sm shadow-sm border outline-none pr-10 ${
            error
              ? "border-red-500 focus:border-red-500"
              : "border-transparent focus:border-gray-300"
          }`}
          type="text"
          placeholder="mm-dd-yyyy"
          value={displayValue}
          onChange={handleDisplayChange}
          disabled={props.disabled}
          required={props.required}
          maxLength={10}
        />

        <Calendar
          onClick={handleIconClick}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
          size={16}
        />
      </div>

      {/* Error message outside the input wrapper */}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default DefaultDatePicker;
