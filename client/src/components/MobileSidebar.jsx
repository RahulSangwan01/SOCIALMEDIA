import { useState } from "react";
import { Link } from "react-router-dom";
import { ProfileCard, FriendsCard, CustomButton } from "./index";
import { NoProfile } from "../assets";

const tabs = [
  { key: "profile", label: "Profile" },
  { key: "requests", label: "Friend Requests" },
  { key: "suggestions", label: "Suggestions" },
];

const MobileSidebar = ({
  open,
  onClose,
  user,
  friendRequest = [],
  suggestedFriends = [],
  onAcceptRequest = () => {},
  onSendRequest = () => {},
}) => {
  const [active, setActive] = useState("profile");

  return (
    <div className={`${open ? "fixed" : "hidden"} inset-0 z-50 md:hidden`}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className={`absolute left-0 top-0 h-full w-[88%] max-w-sm bg-primary shadow-xl transform transition-transform duration-200 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#66666645]">
          <div className="flex items-center gap-2">
            <button aria-label="Close" onClick={onClose} className="text-ascent-1 text-xl">×</button>
            <h3 className="text-ascent-1 text-lg font-semibold">Menu</h3>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 overflow-x-auto border-b border-[#66666645]">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${active === t.key ? "bg-secondary text-ascent-1" : "text-ascent-2 border border-[#666]"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="h-[calc(100%-110px)] overflow-y-auto p-3">
          {active === "profile" && (
            <div className="flex flex-col gap-4">
              <ProfileCard user={user} />
              <FriendsCard friends={user?.friends || []} />
            </div>
          )}

          {active === "requests" && (
            <div className="w-full bg-primary rounded-lg px-3 py-3">
              <div className="flex items-center justify-between text-base text-ascent-1 pb-2 border-b border-[#66666645]">
                <span>Friend Requests</span>
                <span>{friendRequest?.length || 0}</span>
              </div>
              <div className="w-full flex flex-col gap-4 pt-4">
                {friendRequest?.length ? (
                  friendRequest.map(({ _id, requestFrom: from }) => (
                    <div key={_id} className="flex items-center justify-between">
                      <Link to={`/profile/${from?._id}`} className="w-full flex gap-3 items-center">
                        <img src={from?.profileUrl ?? NoProfile} alt={from?.firstName} className="w-10 h-10 object-cover rounded-full" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-ascent-1">{from?.firstName} {from?.lastName}</p>
                          <span className="text-xs text-ascent-2">{from?.profession ?? "No Profession"}</span>
                        </div>
                      </Link>
                      <div className="flex gap-1">
                        <CustomButton title="Accept" onClick={() => onAcceptRequest(_id, "Accepted")} containerStyles="bg-[#FFEA00] text-xs text-white px-1.5 py-1 rounded-full" />
                        <CustomButton title="Deny" onClick={() => onAcceptRequest(_id, "Denied")} containerStyles="border border-[#666] text-xs text-ascent-1 px-1.5 py-1 rounded-full" />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-ascent-2">No requests</p>
                )}
              </div>
            </div>
          )}

          {active === "suggestions" && (
            <div className="w-full bg-primary rounded-lg px-3 py-3">
              <div className="flex items-center justify-between text-base text-ascent-1 pb-2 border-b border-[#66666645]">
                <span>Friend Suggestions</span>
              </div>
              <div className="w-full flex flex-col gap-4 pt-4">
                {suggestedFriends?.length ? (
                  suggestedFriends.map((friend) => (
                    <div key={friend?._id} className="flex items-center justify-between">
                      <Link to={`/profile/${friend?._id}`} className="w-full flex gap-3 items-center">
                        <img src={friend?.profileUrl ?? NoProfile} alt={friend?.firstName} className="w-10 h-10 object-cover rounded-full" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-ascent-1">{friend?.firstName} {friend?.lastName}</p>
                          <span className="text-xs text-ascent-2">{friend?.profession ?? "No Profession"}</span>
                        </div>
                      </Link>
                      <button className="bg-[#FFEA00] text-sm text-white p-1 rounded" onClick={() => onSendRequest(friend?._id)}>
                        +
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-ascent-2">No suggestions</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;
