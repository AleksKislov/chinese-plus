import React, { Fragment, useEffect, useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
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
// import Plans from "../plans/Plans";
import PostPage from "../posts/PostPage";
import TextAddForm from "../texts/TextAddForm";
import TextEditForm from "../texts/TextEditForm";
import Texts from "../texts/Texts";
import TextPage from "../texts/TextPage";
import VideoPage from "../videos/VideoPage";
import Books from "../books/Books";
import BookCardPage from "../books/BookCardPage";
import PageForm from "../books/PageForm";
import ChapterPage from "../books/ChapterPage";
import NotAppovedTexts from "../texts/NotAppovedTexts";
import NotAppovedVideos from "../videos/NotAppovedVideos";
import ActiveUserTable from "../stats/ActiveUserTable";
import AllTextsTable from "../texts/AllTextsTable";
import UserProfile from "../profile/UserProfile";
import Mentions from "../dashboard/Mentions";
import MentionsAlert from "../layout/MentionsAlert";
import Notice from "../layout/Notice";
import SetAvatar from "../profile/SetAvatar";
import SearchHSK from "../hsk-table/SearchHSK";
import SearchNewHSK from "../new-hsk/SearchNewHSK";
import NewHskTable from "../new-hsk/HskTable";
import NewHskTests from "../new-hsk/NewHskTests";

import TranslationForm from "../translation/TranslateForm";
import Videos from "../videos/Videos";
import VideoEditForm from "../videos/VideoEditForm";
import AddVideoForm from "../videos/AddVideoForm";
import CreateContent from "../common/CreateContent";
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
          <Route exact path='/hsk-table' render={() => <Redirect to='/hsk-table/1' />} />
          <Route exact path='/hsk-search' component={SearchHSK} />
          <Route exact path='/hsk-new-search' component={SearchNewHSK} />
          <Route exact path='/hsk-new-table' render={() => <Redirect to='/hsk-new-table/1' />} />
          <Route exact path='/pinyin-tests' component={PinyinTests} />
          <Route exact path='/hsk-tests' render={() => <Redirect to='/hsk-tests/1' />} />
          <Route exact path='/hsk-new-tests' render={() => <Redirect to='/hsk-new-tests/1' />} />

          <Route exact path='/hsk-new-table/:level' component={NewHskTable} />
          <Route exact path='/hsk-table/:level' component={HskTable} />
          <Route exact path='/hsk-tests/:level' component={HskTests} />
          <Route exact path='/hsk-new-tests/:level' component={NewHskTests} />

          <PrivateRoute exact path='/create-profile' component={CreateProfile} />
          <PrivateRoute exact path='/edit-profile' component={EditProfile} />
          <Route exact path='/pinyin' component={PinyinTable} />
          <Route exact path='/search/:chinese' component={Search} />
          <Route exact path='/search' component={Search} />
          <Route exact path='/translate' component={TranslationForm} />

          <Route exact path='/posts' component={Posts} />
          {
            //  <Route exact path='/kanban' component={Plans} />
          }
          <Route exact path='/posts/:id' component={PostPage} />
          <Route exact path='/create-content' component={CreateContent} />

          <Route exact path='/create-text' component={TextAddForm} />
          <Route exact path='/edit-text' component={TextEditForm} />
          <Route exact path='/create-video' component={AddVideoForm} />
          <Route exact path='/edit-video' component={VideoEditForm} />
          <PrivateRoute exact path='/create-bookpage' component={PageForm} />
          <Route exact path='/texts' component={Texts} />
          <Route exact path='/videos' component={Videos} />
          <Route exact path='/all_texts' component={AllTextsTable} />
          <Route exact path='/not_approved_texts' component={NotAppovedTexts} />
          <Route exact path='/not_approved_videos' component={NotAppovedVideos} />
          <Route exact path='/statistics' component={ActiveUserTable} />
          <Route exact path='/books' component={Books} />
          <Route exact path='/texts/:id/:page' component={TextPage} />
          <Route exact path='/texts/:id' component={TextPage} />
          <Route exact path='/videos/:id' component={VideoPage} />
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
