/*
 * @Author: Kyusho 
 * @Date: 2024-02-16 00:15:01 
 * @Last Modified by: Kyusho
 * @Last Modified time: 2024-02-16 00:20:22
 */

import { type ButtonHTMLAttributes, memo, useRef, type MouseEvent } from "react";
import { useButton } from "react-aria";


const Button = memo<ButtonHTMLAttributes<HTMLButtonElement>>(function Button (props) {
  const { onClick } = props;

  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton({
    elementType: "button",
    onPress(e) {
      onClick?.(e as unknown as MouseEvent<HTMLButtonElement>);
    }
  }, ref);
  
  return (
    <button {...props} {...buttonProps} ref={ref} />
  );
});


export default Button;
