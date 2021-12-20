import React, { Fragment, useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import Register from "../auth/Register";
import Login from "../auth/Login";
import GoogleLoginSuccess from "../auth/GoogleLoginSuccess";

import Alert from "../layout/Alert";
import HskTable from "../hsk-table/HskTable";
import Words from "../hsk-table/Words";
import UserWords from "../userWords/UserWords";

import Dashboard from "../dashboard/Dashboard";
import PrivateRoute from "../routing/PrivateRoute";
import PinyinTable from "../pinyinTable/PinyinTable";
import PinyinTests from "../pinyinTable/PinyinTests";
import HskTests from "../hsk-table/HskTests";
import CreateProfile from "../profile/CreateProfile";
import EditProfile from "../profile/EditProfile";
import NotFound from "../layout/NotFound";
import Contacts from "../layout/Contacts";
import Donate from "../layout/Donate";
import Search from "../translation/Search";
import Posts from "../posts/Posts";
import Plans from "../plans/Plans";
import PostPage from "../posts/PostPage";
import TextForm from "../texts/TextForm";
import Texts from "../texts/Texts";
import TextPage from "../texts/TextPage";
import Books from "../books/Books";
import BookCardPage from "../books/BookCardPage";
import PageForm from "../books/PageForm";
import ChapterPage from "../books/ChapterPage";
import NotAppovedTexts from "../texts/NotAppovedTexts";
import ActiveUserTable from "../stats/ActiveUserTable";
import AllTextsTable from "../texts/AllTextsTable";
import UserProfile from "../profile/UserProfile";
import Mentions from "../dashboard/Mentions";
import MentionsAlert from "../layout/MentionsAlert";
import Notice from "../layout/Notice";
import SetAvatar from "../profile/SetAvatar";
import SearchHSK from "../hsk-table/SearchHSK";

import TranslationForm from "../translation/TranslateForm";
// import TranslateForm from "../translation/TranslateForm";
// <PrivateRoute exact path='/translate' component={TranslateForm} />

const Routes = () => {
  useEffect(() => {
    setPathname(window.location.pathname);
  }, [window.location.pathname]);

  const [pathname, setPathname] = useState("");

  // style={{ marginTop: "2rem", marginBottom: "4rem" }}
  return (
    <Fragment>
      <section
        id='mainSection'
        className={pathname === "/pinyin" ? "container-fluid" : "container"}
      >
        <div className='alertDiv'>
          <Alert />
        </div>
        <MentionsAlert />
        <Notice />

        <Switch>
          <Route exact path='/register' component={Register} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/login_success/:id' component={GoogleLoginSuccess} />
          <PrivateRoute exact path='/set_avatar' component={SetAvatar} />
          <PrivateRoute exact path='/dashboard' component={Dashboard} />
          <PrivateRoute exact path='/hsk-words' component={Words} />
          <PrivateRoute exact path='/userwords' component={UserWords} />
          <PrivateRoute exact path='/mentions' component={Mentions} />
          <Route exact path='/hsk-table' component={HskTable} />
          <Route exact path='/hsk-search' component={SearchHSK} />
          <Route exact path='/pinyin-tests' component={PinyinTests} />
          <Route exact path='/hsk-tests' component={HskTests} />
          <PrivateRoute exact path='/create-profile' component={CreateProfile} />
          <PrivateRoute exact path='/edit-profile' component={EditProfile} />
          <Route exact path='/pinyin' component={PinyinTable} />
          <Route exact path='/search/:chinese' component={Search} />
          <Route exact path='/search' component={Search} />
          <Route exact path='/translate' component={TranslationForm} />

          <Route exact path='/posts' component={Posts} />
          <Route exact path='/kanban' component={Plans} />
          <Route exact path='/posts/:id' component={PostPage} />
          <Route exact path='/create-text' component={TextForm} />
          <PrivateRoute exact path='/create-bookpage' component={PageForm} />
          <Route exact path='/texts' component={Texts} />
          <Route exact path='/all_texts' component={AllTextsTable} />
          <Route exact path='/not_approved_texts' component={NotAppovedTexts} />
          <Route exact path='/statistics' component={ActiveUserTable} />
          <Route exact path='/books' component={Books} />
          <Route exact path='/texts/:id/:longtextid' component={TextPage} />
          <Route exact path='/texts/:id' component={TextPage} />
          <Route exact path='/books/:id' component={BookCardPage} />
          <Route exact path='/user/:id' component={UserProfile} />
          <Route exact path='/contacts' component={Contacts} />
          <Route exact path='/donate' component={Donate} />
          <Route exact path='/books/:bookId/:chapterId/:pageInd' component={ChapterPage} />

          <NotFound />
        </Switch>
      </section>
    </Fragment>
  );
};

export default Routes;
