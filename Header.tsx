import React from "react";
import { EPages } from "../../App";

type THeader = {
    setPageName: (name: EPages) => void;
}

const Header: React.FC <THeader> = ({setPageName}) => {

    return (<>
        <h1>Хедер!</h1>
        <button onClick={() => setPageName(EPages.Graph3D)}>3D графика</button>
        <button onClick={() => setPageName(EPages.Graph2D)}>2D графика</button>
        <button onClick={() => setPageName(EPages.Calc)}>Калькулятор</button>
    </>);
}

export default Header;