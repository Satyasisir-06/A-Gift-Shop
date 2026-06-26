"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DB, StudioVideo } from '@/lib/db';
import { Video, Play } from 'lucide-react';

// Helper to extract YouTube video ID
const getYoutubeEmbedUrl = (url: string) => {
  let videoId = '';
  try {
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('youtube.com/watch')) {
      const urlObj = new URL(url);
      videoId = urlObj.searchParams.get('v') || '';
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('youtube.com/embed/')[1].split('?')[0];
    } else if (url.includes('youtube.com/shorts/')) {
      videoId = url.split('youtube.com/shorts/')[1].split('?')[0];
    } else if (url.includes('instagram.com')) {
      // Instagram embedding is complex due to CSP and blockages, 
      // but we can try an iframe or provide a link block. For now, we fallback.
      return null;
    }
  } catch (e) {
    return null;
  }
  
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1` : null;
};

const getInstagramEmbedUrl = (url: string) => {
  try {
    const match = url.match(/(?:p|reel|tv)\/([^\/?#&]+)/);
    if (match) {
      return `https://www.instagram.com/p/${match[1]}/embed`;
    }
  } catch (e) {}
  return null;
};

const getYoutubeThumb = (embedUrl: string | null) => {
  if (!embedUrl) return null;
  const match = embedUrl.match(/embed\/([^?]+)/);
  if (match) return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
  return null;
}

export default function OurWorkPage() {
  const [videos, setVideos] = useState<StudioVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVideos = async () => {
      const vids = await DB.getStudioVideos();
      setVideos(vids);
      setLoading(false);
    };
    loadVideos();
  }, []);

  return (
    <div className="bg-beige min-h-screen pb-24">
      {/* Header */}
      <div className="bg-neutral-900 py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2040&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent"></div>
        
        <div className="section relative z-10 text-center max-w-4xl mx-auto px-5">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-gold uppercase tracking-[0.3em] text-xs font-bold mb-4 block"
          >
            Behind The Scenes
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-4xl sm:text-6xl text-white font-bold uppercase tracking-widest mb-6"
          >
            Our Craftsmanship
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-24 h-px bg-gold/50 mx-auto mb-6"
          ></motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-neutral-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed"
          >
            A glimpse into our studio. See the dedication, precision, and passion that goes into curating every single gift box.
          </motion.p>
        </div>
      </div>

      {/* Videos Section */}
      <div className="section max-w-6xl mx-auto px-5 mt-16 sm:mt-24">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-neutral-300 border-t-gold animate-spin" />
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-32">
            <Video size={48} className="mx-auto text-neutral-300 mb-4" />
            <h3 className="font-heading text-xl text-neutral-900 mb-2">New Stories Coming Soon</h3>
            <p className="text-neutral-500 max-w-md mx-auto">We are currently curating new behind-the-scenes content. Check back shortly!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
            {videos.map((video, index) => {
              const ytEmbedUrl = getYoutubeEmbedUrl(video.url);
              const igEmbedUrl = getInstagramEmbedUrl(video.url);
              const fallbackThumb = video.thumbnail || getYoutubeThumb(ytEmbedUrl) || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2040&auto=format&fit=crop';
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="aspect-video w-full rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-200 shadow-xl relative z-10 group-hover:shadow-2xl transition-all duration-500">
                    {ytEmbedUrl ? (
                      <iframe 
                        src={ytEmbedUrl} 
                        title={`Studio Video ${index + 1}`}
                        className="w-full h-full object-cover"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      ></iframe>
                    ) : igEmbedUrl ? (
                      <iframe 
                        src={igEmbedUrl} 
                        title={`Instagram Video ${index + 1}`}
                        className="w-full h-full border-none"
                        scrolling="no"
                        allowtransparency="true"
                        allow="encrypted-media"
                      ></iframe>
                    ) : (
                      <a href={video.url} target="_blank" rel="noopener noreferrer" className="absolute inset-0 block group bg-neutral-900">
                        <img src={fallbackThumb} alt="Video Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-50 group-hover:opacity-30" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md mb-4 group-hover:scale-110 group-hover:bg-gold/30 transition-all border border-white/30">
                            <Play size={24} className="text-white ml-1" />
                          </div>
                          <span className="text-white font-medium drop-shadow-md tracking-wider uppercase text-sm">
                            {video.url.toLowerCase().includes('youtu') ? 'Watch on YouTube' : 'Watch on Instagram'}
                          </span>
                        </div>
                      </a>
                    )}
                  </div>
                  {/* Decorative element */}
                  <div className="absolute -bottom-4 -right-4 w-2/3 h-2/3 bg-gold/10 rounded-3xl -z-10 transition-transform duration-500 group-hover:translate-x-2 group-hover:translate-y-2 blur-2xl"></div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
