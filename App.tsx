import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './components/Header/Header';
import Graph2D from './components/Graph2D/Graph2D';
import Graph3D from './components/Graph3D/Graph3D';
import Calc from './components/Calc/Calc';

export enum EPages {
  Calc,
  Graph2D,
  Graph3D
}

const App: React.FC = () => {
  const[pageName, setPageName] = useState<EPages>(EPages.Calc);
  return (<div className="app">
    <Header setPageName = {setPageName}/>
    {pageName === EPages.Calc && <Calc/>}
    {pageName === EPages.Graph3D && <Graph3D/>}
    {pageName === EPages.Graph2D && <Graph2D/>}
      </div>);
}

export default App;
