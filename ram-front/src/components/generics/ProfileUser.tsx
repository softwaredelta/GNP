// (c) Delta Software 2023, rights reserved.

import React from "react";

interface IUserProfileProps {
  name?: string;
  level?: string;
  ImageURL?: string;
}

const UserProfile: React.FC<IUserProfileProps> = ({
  name,
  level,
  ImageURL: profileImageUrl,
}) => {
  return (
    <div className="flex flex-col items-center justify-center bg-slate-200">
      <img
        src={profileImageUrl}
        alt={`${name}'s profile picture`}
        className="w-32 h-32 rounded-full object-cover mt-4"
      />
      <h2 className="mt-4 font-bold text-2xl text-gray-800 text-center">
        {name}
      </h2>
      <p className="text-lg text-gray-600">
        <b>Nivel: </b>
        {level}
      </p>
    </div>
  );
};

export default UserProfile;
