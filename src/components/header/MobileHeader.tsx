import { Col, Row, Layout, Avatar } from "antd";
import { MenuBurger } from "./MenuBurger";
import { useState } from "react";

interface MobileHeaderProps {
  toggleSider: () => void;
  isSiderOpened: boolean;
}

const { Header } = Layout;

export const MobileHeader = ({ toggleSider }: MobileHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
    toggleSider();
  };

  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1,
        width: "100%",
        backgroundColor: "white",
      }}
      className="p-4"
    >
      <Row justify="space-between" align="middle" className="mt-4">
        <Col className="flex z-[999]">
          <Avatar size={40} src="https://picsum.photos/id/64/100/100" />
        </Col>
        <MenuBurger onClick={handleClick} isOpen={isOpen} />
      </Row>
    </Header>
  );
};
