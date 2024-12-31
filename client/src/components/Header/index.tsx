import React from "react";

type HeaderProps = {
  name: string;
  children?: React.ReactNode;
  isSmallText?: boolean;
};

const Header = ({
  name,
  children,
  isSmallText = false,
}: HeaderProps) => {
  return (
    <div className="mb-5 flex w-full items-center justify-between">
      <h1
        className={`${isSmallText ? "text-lg" : "text-2xl"} font-semibold dark:text-white`}
      >
        {name}
      </h1>
      {children}
    </div>
  );
};

export default Header;
