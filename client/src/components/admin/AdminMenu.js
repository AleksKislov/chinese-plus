import React from "react";
import { Link } from "react-router-dom";

const AdminMenu = ({}) => {
  const menu = ["notices", "words"];
  return (
    <div>
      {menu.map((w, i) => (
        <Link to={`/ad/${w}`} key={i}>
          <div className='btn btn-sm btn-outline-info mx-2'>{w}</div>
        </Link>
      ))}
    </div>
  );
};

export default AdminMenu;
