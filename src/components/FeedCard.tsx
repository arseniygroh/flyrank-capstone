"use client";

import { useState } from "react";
import Link from "next/link";
import { Music, ThumbsUp, ThumbsDown, MessageSquare, Send } from "lucide-react";
import { Playlist } from "@/types/playlist";
import { API_URL } from "@/context/PlaylistsContext";
import { useAuth } from "@/context/AuthContext";

interface Comment {
    id: string;
    userId: string;
    username: string;
    timestamp: string;
    content: string;
}

export default function FeedCard({ playlist }: { playlist: Playlist }) {
  const { token } = useAuth();
  
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [likesCount, setLikesCount] = useState(playlist.likes?.length || 0);
  const [dislikesCount, setDislikesCount] = useState(playlist.dislikes?.length || 0);
  const [comments, setComments] = useState<Comment[]>(playlist.comments || []);
  console.log(comments);
  
  const handleRate = async (type: "like" | "dislike") => {
    if (!token) {
      alert("Please log in to interact with playlists.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/playlists/${playlist.id}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({type})
      });

      if (res.ok) {
        const data = await res.json();
        setLikesCount(data.likesCount);
        setDislikesCount(data.dislikesCount);
      }
    } catch (error) {
      console.error("Failed to rate playlist:", error);
    }
  };
  
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !token) return;
    
    setIsSubmitting(true);
    
    try {
      const res = await fetch(`${API_URL}/playlists/${playlist.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({commentText})
      });

      if (res.ok) {
        const newComment = await res.json();
        setComments(prev => [...prev, newComment]);
        setCommentText("");
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setIsSubmitting(false);
    }
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
        <button onClick={() => handleRate("like")} className="flex items-center gap-2 text-neutral-400 hover:text-green-400 transition-colors group">
          <ThumbsUp className="w-5 h-5 group-active:scale-90 transition-transform" /> 
          <span className="font-bold">{likesCount}</span>
        </button>
        
        <button onClick={() => handleRate("dislike")} className="flex items-center gap-2 text-neutral-400 hover:text-red-400 transition-colors group">
          <ThumbsDown className="w-5 h-5 group-active:scale-90 transition-transform" /> 
          <span className="font-bold">{dislikesCount}</span>
        </button>

        <div className="flex items-center gap-2 text-neutral-400 ml-auto">
          <MessageSquare className="w-5 h-5" /> 
          <span className="font-bold">{comments.length}</span>
        </div>
      </div>
      {comments.length > 0 && (
        <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-900/50 flex flex-col gap-3 max-h-48 overflow-y-auto">
          {comments.map((comment: any) => {
            const formattedDate = comment.timestamp 
                ? new Date(comment.timestamp).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                })
                : "";

            return (
                <div 
                key={comment.id} 
                className="flex flex-col gap-1 bg-neutral-950/50 p-3 rounded-xl border border-neutral-800/50"
                >
                <div className="flex items-baseline justify-between">
                    <span className="font-bold text-neutral-200 text-sm">
                        {comment.username}
                    </span>
                    <span className="text-xs text-neutral-500 font-medium">
                        {formattedDate}
                    </span>
                </div>
                    <p className="text-neutral-300 text-sm leading-relaxed">
                        {comment.content}
                    </p>
                </div>
            );
            })}
        </div>
      )}
      {token && (
        <form onSubmit={handleCommentSubmit} className="p-4 border-t border-neutral-800 bg-neutral-900 flex items-center gap-3">
            <input 
                type="text" 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-grow bg-neutral-950 border border-neutral-800 rounded-full px-5 py-2.5 text-sm text-white focus:outline-none focus:border-neutral-600 transition-colors"
                disabled={isSubmitting || !token}
            />
            <button 
                type="submit"
                disabled={!commentText.trim() || isSubmitting || !token}
                className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-200 transition-colors shrink-0"
            >
                <Send className="w-4 h-4 ml-[-2px]" />
            </button>
        </form>
      )}
    </article>
  );
}