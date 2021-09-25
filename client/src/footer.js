import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

function Footer() {
  return (
    // <div className="App-footer">
    //   <p>Copyright © Your Website 2021</p>
    // </div>
    <footer className="bg-light text-left text-lg-start fixed-bottom">
      <div className="text-left p-3" style={{ backgroundColor: '#282c34', color: '#fff'}}>
      Copyright © Bicicletas 2021
      </div>
    </footer>
  );
}

export default Footer;