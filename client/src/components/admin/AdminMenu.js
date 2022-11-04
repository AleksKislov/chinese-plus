import React from "react";
import { Link } from "react-router-dom";

const AdminMenu = ({}) => {
  return (
    <div>
      <Link to='/ad/notices'>
        <div className='btn btn-sm btn-outline-info'>Notices</div>
      </Link>
    </div>
  );
};

export default AdminMenu;
