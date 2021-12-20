import React from "react";
import { Link } from "react-router-dom";

const RatingItem = ({ user, ind }) => {
  const { num, userid, length, name } = user;

  let index;
  index = ind + 1;
  if (ind === 0) index = <h3>🥇</h3>;
  if (ind === 1) index = <h3>🥈</h3>;
  if (ind === 2) index = <h3>🥉</h3>;

  return (
    <tr className={ind === 0 || ind === 1 || ind === 2 ? "font-weight-bold" : ""}>
      <td>{index}</td>
      <td className='text-left'>
        <Link to={`/user/${userid}`}>{name}</Link>
      </td>
      <td>{num}</td>
      <td>{length}</td>
    </tr>
  );
};

export default RatingItem;
