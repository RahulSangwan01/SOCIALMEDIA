import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CustomButton,
  EditProfile,
  FriendsCard,
  Loading,
  PostCard,
  ProfileCard,
  TextInput,
  TopBar,
} from "../components";
import MobileSidebar from "../components/MobileSidebar";
import { Link } from "react-router-dom";
import { NoProfile } from "../assets";
import { BsFiletypeGif, BsPersonFillAdd } from "react-icons/bs";
import { BiImages, BiSolidVideo } from "react-icons/bi";
import { useForm } from "react-hook-form";
import { apiRequest, deletePost, fetchPosts, getUserInfo, handleFileUpload, likePost, sendFriendRequest, searchUsers } from "../utils"; 
import { UserLogin } from "../redux/userSlice";


const Home = () => {
  const { user, edit } = useSelector((state) => state.user);
  const {posts} = useSelector(state => state.posts);
  const [friendRequest, setFriendRequest] = useState([]);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [userQ, setUserQ] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [searchingUsers, setSearchingUsers] = useState(false);
  const [sentUserIds, setSentUserIds] = useState([]);
  const [file, setFile] = useState(null);
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showMobilePanel, setShowMobilePanel] = useState(false);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handlePostSubmit = async (data) => {
    setPosting(true);
    setErrMsg("");

    try{
      const uri = file && (await handleFileUpload(file));

      const newData = uri ? { ...data, image: uri } : data;

      const res = await apiRequest({
        url: "/posts/create-post",
        data: newData,
        token: user?.token,
        method: "POST",
      });

      if (res?.status === "failed") {
        setErrMsg(res);
      } 
      else{
        reset({
          description: "",
        });
        setFile(null);
        setErrMsg("");
        await fetchPost();
      }
      setPosting(false);

    } catch(error) {
      console.log(error);
      setPosting(false);
    }
  };

  const fetchPost = async() => {
    await fetchPosts(user?.token, dispatch);

    setLoading(false);
  };

  const handleLikePost = async(uri) => {
      await likePost({ uri: uri, token: user?.token});

      await fetchPost();
  };

  const handleDelete = async(id) => {
    await deletePost(id, user.token);
    await fetchPost();
  }; 

  const fetchFriendRequests = async() => {
    try{
      const res = await apiRequest({
        url: "/users/get-friend-request",
        token: user?.token,
        method: "POST",
      });
      setFriendRequest(res?.data);
      console.log("Friend Requests Response: ", res);
    }
    catch(error){
      console.log(error);
    }
  };

  const fetchSuggestedFriends = async() => {
    try{
      const res = await apiRequest({
        url: "/users/suggested-friends",
        token: user?.token,
        method: "POST",
      });
      setSuggestedFriends(res?.suggestedFriends);
      console.log("Suggested Friends Response: ", res);
    }
    catch(error){
      console.log(error);
    }
  };
   
  const handleFriendRequest = async(id) => {
    try{
      const res = await sendFriendRequest(user.token, id);
      await fetchFriendRequests();
    }
    catch(error){
      console.log(error);
    }
  };

  const acceptFriendRequest = async(id, status) => {
    try{
      await apiRequest({
        url: "/users/accept-request",
        token: user?.token,
        method: "POST",
        data: { rid: id, status },
      });
      await fetchFriendRequests();
    }
    catch(error){
      console.log(error);
    }
  };

  const handleUserSearch = async(value) => {
    setUserQ(value);
    if (!value || value.trim().length < 2) { setUserResults([]); return; }
    try {
      setSearchingUsers(true);
      const users = await searchUsers(user?.token, value.trim());
      setUserResults(users || []);
    } finally { setSearchingUsers(false); }
  };

  const getUser = async() => {
    const res = await getUserInfo(user?.token);
    const newData = { token: user?.token, ...res};
    dispatch(UserLogin(newData));
  };


  useEffect(() => {
    setLoading(true);
    getUser();
    fetchPost();
    fetchFriendRequests();
    fetchSuggestedFriends();
  }, []);

  return (
    <>
      <div className='w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden'>
        <TopBar onOpenMobilePanel={() => setShowMobilePanel(true)} />

        <div className='w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full'>
          {/* LEFT */}
          <div className='hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto'>
            <ProfileCard user={user} />
            <FriendsCard friends={user?.friends} />
          </div>

          {/* CENTER */}
          <div className='flex-1 h-full px-4 flex flex-col gap-6 overflow-y-auto rounded-lg'>
            <form
              onSubmit={handleSubmit(handlePostSubmit)}
              className='bg-primary px-4 rounded-lg'
            >
              <div className='w-full flex items-center gap-2 py-4 border-b border-[#66666645]'>
                <img
                  src={user?.profileUrl ?? NoProfile}
                  alt='User Image'
                  className='w-14 h-14 rounded-full object-cover'
                />
                <TextInput
                  styles='w-full rounded-full py-5'
                  placeholder="What's on your mind...."
                  name='description'
                  register={register("description", {
                    required: "Write something about post",
                  })}
                  error={errors.description ? errors.description.message : ""}
                />
              </div>
              {errMsg?.message && (
                <span
                  role='alert'
                  className={`text-sm ${
                    errMsg?.status === "failed"
                      ? "text-[#f64949fe]"
                      : "text-[#2ba150fe]"
                  } mt-0.5`}
                >
                  {errMsg?.message}
                </span>
              )}

              <div className='flex items-center justify-between py-4'>
                <label
                  htmlFor='imgUpload'
                  className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'
                >
                  <input
                    type='file'
                    onChange={(e) => setFile(e.target.files[0])}
                    className='hidden'
                    id='imgUpload'
                    data-max-size='5120'
                    accept='.jpg, .png, .jpeg'
                  />
                  <BiImages />
                  <span>Image</span>
                </label>

                <label
                  className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'
                  htmlFor='videoUpload'
                >
                  <input
                    type='file'
                    data-max-size='5120'
                    onChange={(e) => setFile(e.target.files[0])}
                    className='hidden'
                    id='videoUpload'
                    accept='.mp4, .wav'
                  />
                  <BiSolidVideo />
                  <span>Video</span>
                </label>

                <label
                  className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'
                  htmlFor='vgifUpload'
                >
                  <input
                    type='file'
                    data-max-size='5120'
                    onChange={(e) => setFile(e.target.files[0])}
                    className='hidden'
                    id='vgifUpload'
                    accept='.gif'
                  />
                  <BsFiletypeGif />
                  <span>Gif</span>
                </label>

                <div>
                  {posting ? (
                    <Loading />
                  ) : (
                    <CustomButton
                      type='submit'
                      title='Post'
                      containerStyles='bg-[#FFEA00] text-white py-1 px-6 rounded-full font-semibold text-sm'
                    />
                  )}
                </div>
              </div>
            </form>

            {loading ? (
              <Loading />
            ) : posts?.length > 0 ? (
              posts?.map((post) => (
                <PostCard
                  key={post?._id}
                  post={post}
                  user={user}
                  deletePost={handleDelete}
                  likePost={handleLikePost}
                />
              ))
            ) : (
              <div className='flex w-full h-full items-center justify-center'>
                <p className='text-lg text-ascent-2'>No Post Available</p>
              </div>
            )}
          </div>

          {/* RIGJT */}
          <div className='hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto'>
            {/* SEARCH PEOPLE */}
            <div className='w-full bg-primary shadow-sm rounded-lg px-6 py-5 relative'>
              <div className='flex items-center justify-between text-lg text-ascent-1 pb-2 border-b border-[#66666645]'>
                <span>Search People</span>
              </div>
              <div className='pt-3'>
                <div className='flex gap-2 items-center'>
                  <div className='relative flex-1'>
                    <input
                      value={userQ}
                      onChange={(e)=>handleUserSearch(e.target.value)}
                      placeholder='Search people...'
                      className='w-full bg-secondary text-ascent-1 rounded-full pr-10 pl-4 py-2 text-sm outline-none'
                    />
                    {userQ ? (
                      <button aria-label='Clear' onClick={()=>{ setUserQ(''); setUserResults([]); }} className='absolute right-2 top-1/2 -translate-y-1/2 text-ascent-2 hover:text-ascent-1'>×</button>
                    ) : null}
                  </div>
                  <button className='px-4 py-2 rounded-full bg-[#FFEA00] text-white text-sm' onClick={()=>handleUserSearch(userQ)}>Search</button>
                </div>

                {userQ?.trim().length >= 2 && (
                  <div className='absolute left-6 right-6 mt-2 z-20'>
                    <div className='bg-primary border border-[#66666645] rounded-lg shadow-xl max-h-72 overflow-y-auto divide-y divide-[#66666645]'>
                      {searchingUsers ? (
                        <div className='px-3 py-2 text-xs text-ascent-2 flex items-center gap-2'>
                          <svg className='animate-spin h-4 w-4 text-ascent-2' viewBox='0 0 24 24'><circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle><path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'></path></svg>
                          Searching...
                        </div>
                      ) : (userResults?.length ? (
                        userResults.filter(Boolean).map((u, idx)=> (
                          <div key={u?._id || idx} className='px-3 py-2 flex items-center gap-3'>
                            <Link to={'/profile/' + (u?._id || '')} className='flex-1 flex items-center gap-3 min-w-0'>
                              <img src={u?.profileUrl ?? NoProfile} alt={u?.firstName} className='w-9 h-9 object-cover rounded-full flex-shrink-0' />
                              <div className='min-w-0'>
                                <p className='text-sm font-medium text-ascent-1 truncate'>{u?.firstName} {u?.lastName}</p>
                                <span className='text-xs text-ascent-2 truncate block'>{u?.profession ?? 'No Profession'}</span>
                              </div>
                            </Link>
                            {sentUserIds.includes(u?._id) ? (
                              <span className='text-xs text-ascent-2 px-2 py-1'>Sent</span>
                            ) : (
                              <button
                                disabled={!u?._id}
                                className='bg-[#FFEA00] text-xs text-white px-2 py-1 rounded flex-shrink-0 disabled:opacity-60 disabled:cursor-not-allowed'
                                onClick={async () => { if (!u?._id) return; await handleFriendRequest(u._id); setSentUserIds((ids)=> ids.includes(u._id) ? ids : [...ids, u._id]); }}
                              >
                                Add
                              </button>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className='px-3 py-2 text-xs text-ascent-2'>No users found</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* FRIEND REQUEST */}
            <div className='w-full bg-primary shadow-sm rounded-lg px-6 py-5'>
              <div className='flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]'>
                <span> Friend Request</span>
                <span>{friendRequest?.length}</span>
              </div>

              <div className='w-full flex flex-col gap-4 pt-4'>
                {friendRequest?.filter(Boolean).map((req, idx) => (
                  <div key={req?._id || idx} className='flex items-center justify-between'>
                    <Link
                      to={"/profile/" + (req?.requestFrom?._id || "")}
                      className='w-full flex gap-4 items-center cursor-pointer'
                    >
                      <img
                        src={req?.requestFrom?.profileUrl ?? NoProfile}
                        alt={req?.requestFrom?.firstName}
                        className='w-10 h-10 object-cover rounded-full'
                      />
                      <div className='flex-1'>
                        <p className='text-base font-medium text-ascent-1'>
                          {req?.requestFrom?.firstName} {req?.requestFrom?.lastName}
                        </p>
                        <span className='text-sm text-ascent-2'>
                          {req?.requestFrom?.profession ?? "No Profession"}
                        </span>
                      </div>
                    </Link>

                    <div className='flex gap-1'>
                      <CustomButton
                        title='Accept'
                        onClick={() => acceptFriendRequest(req?._id || idx, "Accepted")}
                        containerStyles='bg-[#FFEA00] text-xs text-white px-1.5 py-1 rounded-full'
                      />
                      <CustomButton
                        title='Deny'
                        onClick={() => acceptFriendRequest(req?._id || idx, "Denied")}
                        containerStyles='border border-[#666] text-xs text-ascent-1 px-1.5 py-1 rounded-full'
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SUGGESTED FRIENDS */}
            <div className='w-full bg-primary shadow-sm rounded-lg px-5 py-5'>
              <div className='flex items-center justify-between text-lg text-ascent-1 border-b border-[#66666645]'>
                <span>Friend Suggestion</span>
              </div>
              <div className='w-full flex flex-col gap-4 pt-4'>
                {suggestedFriends?.filter(Boolean).map((friend, idx) => (
                  <div
                    className='flex items-center justify-between'
                    key={friend?._id || idx}
                  >
                    <Link
                      to={"/profile/" + (friend?._id || "")}
                      className='w-full flex gap-4 items-center cursor-pointer'
                    >
                      <img
                        src={friend?.profileUrl ?? NoProfile}
                        alt={friend?.firstName}
                        className='w-10 h-10 object-cover rounded-full'
                      />
                      <div className='flex-1 '>
                        <p className='text-base font-medium text-ascent-1'>
                          {friend?.firstName} {friend?.lastName}
                        </p>
                        <span className='text-sm text-ascent-2'>
                          {friend?.profession ?? "No Profession"}
                        </span>
                      </div>
                    </Link>

                    <div className='flex gap-1'>
                      <button
                        className='bg-[#FFEA00] text-sm text-white p-1 rounded'
                        onClick={() => handleFriendRequest(friend?._id)}
                      >
                        <BsPersonFillAdd size={20} className='text-[#0f52b6]' />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
          </div>
        </div>
        </div>
      </div>

      <MobileSidebar
        open={showMobilePanel}
        onClose={() => setShowMobilePanel(false)}
        user={user}
        friendRequest={friendRequest}
        suggestedFriends={suggestedFriends}
        onAcceptRequest={acceptFriendRequest}
        onSendRequest={handleFriendRequest}
      />


      {edit && <EditProfile />}
    </>
  );
};

export default Home;
