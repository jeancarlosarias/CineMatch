import { Button } from "antd";

const CustomButton = ({ text, type = "primary", onClick, disabled = false }) => {
  return (
    <Button type={type} onClick={onClick} disabled={disabled}>
      {text}
    </Button>
  );
};

export default CustomButton;