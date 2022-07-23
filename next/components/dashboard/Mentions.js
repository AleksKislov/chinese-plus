import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { fromNow } from "../../actions/helpers";
import { getMentionsLen } from "../../actions/comments";
import { connect } from "react-redux";
import { clearText } from "../../actions/texts";

const Mentions = ({ getMentionsLen, clearText }) => {
  useEffect(() => {
    clearText();
  }, []);
  const [mentions, setMentions] = useState(null);
  const [isSeen, setIsSeen] = useState("false");
  useEffect(() => {
    getMentions(isSeen);
  }, [isSeen]);

  const getMentions = async seenIt => {
    try {
      const { data } = await axios.get("/api/comments/to_me/" + seenIt);
      setMentions(data);
    } catch (err) {
      console.log(err);
    }
  };

  const markArSeen = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    try {
      await axios.post("/api/comments/mark_mentions_as_seen", {}, config);
    } catch (err) {
      console.log(err);
    }
    setIsSeen("true");
    await getMentions("true");
    await getMentionsLen();
  };

  return (
    <div className='row'>
      <div className='col-md-12'>
        <h3 className=''>Ответы и упоминания</h3>
      </div>
      <div className='col-md-4'>
        <div className='btn-group w-100 mb-1' role='group'>
          <button
            className={`btn btn-${isSeen === "true" ? "secondary" : "success"} btn-sm`}
            type='button'
            onClick={() => setIsSeen("false")}
          >
            Новые
          </button>
          <button
            type='button'
            className={`btn btn-${isSeen === "true" ? "success" : "secondary"} btn-sm`}
            onClick={() => setIsSeen("true")}
          >
            Прочитанное
          </button>
        </div>
      </div>
      <div className='col-md-12'>
        {isSeen === "false" && mentions && mentions.length > 0 && (
          <button className='btn btn-outline-info my-2 btn-sm' onClick={markArSeen}>
            Пометить как прочитанное
          </button>
        )}
        <ul className='list-group'>
          {mentions &&
            mentions.map(comment => (
              <Link
                to={`/${comment.destination}s/${comment.path || comment.post_id}`}
                className='list-group-item list-group-item-action'
                key={comment._id}
              >
                <span className='text-success'>{comment.name}</span>
                <span className='badge badge-primary float-right mx-2'>
                  {fromNow(comment.date)}
                </span>
                <p dangerouslySetInnerHTML={{ __html: comment.text }} className='commentP'></p>
              </Link>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default connect(null, { getMentionsLen, clearText })(Mentions);
