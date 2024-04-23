import { useEffect, useState } from "react";
import { currentTime, dateDifference } from "../utils/utils";

const Auth = () => {
  useEffect(() => {
    const diff = dateDifference(currentTime(60), currentTime(46));
    console.log("Resultado: " + diff);
  }, []);

  return <h1>Auth</h1>;
};

export default Auth;
