"use client";

import { useState } from "react";
import Link from "next/link";
import { Music, ThumbsUp, ThumbsDown, MessageSquare, Send } from "lucide-react";
import { Playlist } from "@/types/playlist";

export default function FeedCard({ playlist }: { playlist: Playlist }) {
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLike = () => console.log("Liked", playlist.id);
  const handleDislike = () => console.log("Disliked", playlist.id);
  
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    setIsSubmitting(true);
    console.log("Submitting comment:", commentText);
    
    setCommentText("");
    setIsSubmitting(false);
  };

  return (
    <article className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col">
      <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-sm text-neutral-400">Created by</p>
            <p className="font-bold text-white leading-tight">{playlist.creatorName}</p>
          </div>
        </div>
        <Link 
          href={`/playlist/${playlist.id}`}
          className="text-sm font-bold text-neutral-400 hover:text-white transition-colors bg-neutral-800 px-4 py-1.5 rounded-full"
        >
          View Playlist
        </Link>
      </div>

      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-20 h-20 bg-neutral-800 rounded-xl flex items-center justify-center shrink-0">
            <Music className="w-10 h-10 text-neutral-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {playlist.name}
            </h2>
            <span className="bg-white/10 text-white text-xs font-bold px-3 py-1 rounded-full">
              {playlist.tracks?.length || 0} tracks
            </span>
          </div>
        </div>
        <p className="text-neutral-300 text-lg">
          {playlist.description || "No description provided."}
        </p>
      </div>

      <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-950/50 flex items-center gap-6">
        <button onClick={handleLike} className="flex items-center gap-2 text-neutral-400 hover:text-green-400 transition-colors group">
          <ThumbsUp className="w-5 h-5 group-active:scale-90 transition-transform" /> 
          <span className="font-bold">{playlist.likesCount || 0}</span>
        </button>
        
        <button onClick={handleDislike} className="flex items-center gap-2 text-neutral-400 hover:text-red-400 transition-colors group">
          <ThumbsDown className="w-5 h-5 group-active:scale-90 transition-transform" /> 
          <span className="font-bold">{playlist.dislikesCount || 0}</span>
        </button>

        <div className="flex items-center gap-2 text-neutral-400 ml-auto">
          <MessageSquare className="w-5 h-5" /> 
          <span className="font-bold">{playlist.commentsCount || 0}</span>
        </div>
      </div>

      <form onSubmit={handleCommentSubmit} className="p-4 border-t border-neutral-800 bg-neutral-900 flex items-center gap-3">
        <input 
          type="text" 
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          className="flex-grow bg-neutral-950 border border-neutral-800 rounded-full px-5 py-2.5 text-sm text-white focus:outline-none focus:border-neutral-600 transition-colors"
          disabled={isSubmitting}
        />
        <button 
          type="submit"
          disabled={!commentText.trim() || isSubmitting}
          className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-200 transition-colors shrink-0"
        >
          <Send className="w-4 h-4 ml-[-2px]" />
        </button>
      </form>
    </article>
  );
}