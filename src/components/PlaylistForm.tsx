"use client";

import { useState } from "react";
import type { Playlist, PlaylistFormData, PlaylistPrivacy } from "@/types/playlist";

const PRIVACY_OPTIONS: PlaylistPrivacy[] = ["Public", "Private", "Collaborative"];

function isDescriptionRequired(privacy: PlaylistPrivacy) {
  return privacy === "Public" || privacy === "Collaborative";
}

function isFormValid({ name, privacy, description }: PlaylistFormData) {
  if (name.trim().length < 3) {
    return false;
  }

  if (isDescriptionRequired(privacy) && description.trim().length === 0) {
    return false;
  }

  return true;
}

type PlaylistFormProps = {
  onSubmit?: (data: PlaylistFormData) => void | Promise<void>;
  initialData?: Playlist;
  onCancel?: () => void;
};

export default function PlaylistForm({
  onSubmit,
  initialData,
  onCancel,
}: PlaylistFormProps) {
  const [name, setName] = useState(initialData ? initialData.name : "");
  const [privacy, setPrivacy] = useState<PlaylistPrivacy>(
    initialData ? initialData.privacy : "Private"
  );
  const [description, setDescription] = useState(
    initialData ? initialData.description : ""
  );
  const [isTouched, setIsTouched] = useState(false);

  const nameTooShort = name.length > 0 && name.trim().length < 3;
  const descriptionRequired = isDescriptionRequired(privacy);
  const descriptionMissing = descriptionRequired && description.trim().length === 0;
  const formValid = isFormValid({ name, privacy, description });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsTouched(true);
    if (!formValid || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.({ name: name.trim(), privacy, description: description.trim() });
      if (!initialData) {
        setName("");
        setPrivacy("Private");
        setDescription("");
        setIsTouched(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="flex w-full max-w-md flex-col gap-6 rounded-xl bg-neutral-900 p-8 text-white shadow-lg"
      onSubmit={handleSubmit}
      noValidate
    >
      <div>
        <label
          className="text-sm font-semibold text-neutral-300"
          htmlFor="playlist-name"
        >
          Playlist Name
        </label>
        <input
          className="mt-2 w-full rounded-md border border-neutral-700 bg-neutral-800 p-3 transition-all focus:outline-none focus:ring-2 focus:ring-green-500"
          id="playlist-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          onBlur={() => setIsTouched(true)}
        />
        {nameTooShort && isTouched && (
          <p role="alert" className="mt-1 text-sm text-red-500">
            Playlist name must be at least 3 characters long.
          </p>
        )}
      </div>

      <div>
        <label
          className="text-sm font-semibold text-neutral-300"
          htmlFor="playlist-privacy"
        >
          Privacy
        </label>
        <select
          className="mt-2 w-full rounded-md border border-neutral-700 bg-neutral-800 p-3 transition-all focus:outline-none focus:ring-2 focus:ring-green-500"
          id="playlist-privacy"
          value={privacy}
          onChange={(event) =>
            setPrivacy(event.target.value as PlaylistPrivacy)
          }
        >
          {PRIVACY_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          className="text-sm font-semibold text-neutral-300"
          htmlFor="playlist-description"
        >
          Description
        </label>
        <textarea
          className="mt-2 w-full rounded-md border border-neutral-700 bg-neutral-800 p-3 transition-all focus:outline-none focus:ring-2 focus:ring-green-500"
          id="playlist-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          aria-required={descriptionRequired}
        />
        {descriptionMissing && isTouched && (
          <p role="alert" className="mt-1 text-sm text-red-500">
            A description is required for {privacy.toLowerCase()} playlists.
          </p>
        )}
      </div>

      <button
        className="mt-4 w-full rounded-full bg-green-500 py-3 font-bold text-black transition-colors hover:bg-green-400 disabled:cursor-not-allowed disabled:bg-neutral-600 disabled:text-neutral-400"
        type="submit"
        disabled={!formValid || isSubmitting}
        aria-disabled={!formValid || isSubmitting}
      >
        {isSubmitting ? "Saving…" : initialData ? "Save Changes" : "Create Playlist"}
      </button>
      {initialData && onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="mt-2 w-full rounded-full border border-neutral-600 bg-transparent py-3 font-bold text-neutral-300 transition-colors hover:bg-neutral-800"
        >
          Cancel
        </button>
      )}
    </form>
  );
}
