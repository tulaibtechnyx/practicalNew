import React from "react";
import useMediaQuery from "@mui/material/useMediaQuery"

export default function GoogleReviewsBadge({ style = {}, className = "", matches, rating = 5 }) {
  // Calculate full, half, and empty stars
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const isMax1980 = useMediaQuery("(max-width: 1980px)");
  const isMax1680 = useMediaQuery("(max-width: 1680px)");
  const isMax1440 = useMediaQuery("(max-width: 1440px)");
  const isMax1280 = useMediaQuery("(max-width: 1280px)");
  const isMax991 = useMediaQuery("(max-width: 991px)");
  const isMax768 = useMediaQuery("(max-width: 768px)");
  const isMax600 = useMediaQuery("(max-width: 600px)");

  const starSize = isMax600 ? 26 : isMax768 ? 30 : isMax991 ? 31 : isMax1280 ? 37 : isMax1440 ? 42 : isMax1680? 45 : 48;

  const FullStar = (
    <svg width={starSize} height={starSize} viewBox="0 0 24 24" fill="#F2BC41">
      <path d="M12 .587l3.668 7.424 8.204 1.192-5.954 5.803 1.405 8.169L12 18.896l-7.323 3.854 1.405-8.169-5.954-5.803 8.204-1.192L12 .587z" />
    </svg>
  );
  const HalfStar = (
    <svg width={starSize} height={starSize} viewBox="0 0 24 24">
      <defs>
        <linearGradient id="half-grad">
          <stop offset="50%" stopColor="#F2BC41" />
          <stop offset="50%" stopColor="#e0e0e0" />
        </linearGradient>
      </defs>
      <path d="M12 .587l3.668 7.424 8.204 1.192-5.954 5.803 1.405 8.169L12 18.896l-7.323 3.854 1.405-8.169-5.954-5.803 8.204-1.192L12 .587z" fill="url(#half-grad)" />
    </svg>
  );
  const EmptyStar = (
    <svg width={starSize} height={starSize} viewBox="0 0 24 24" fill="#e0e0e0">
      <path d="M12 .587l3.668 7.424 8.204 1.192-5.954 5.803 1.405 8.169L12 18.896l-7.323 3.854 1.405-8.169-5.954-5.803 8.204-1.192L12 .587z" />
    </svg>
  );

  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: 'column',
        justifyContent: 'center',
        background: "#fff",
        borderRadius: "18px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        padding: isMax768 ? "10px 10px" : isMax991 ? "12px 14px" : "14px 16px",
        // minWidth: 260,
        minHeight: 60,
        ...style,
      }}
    >
      {/* Stars 1*/}
      {/* <div style={{ display: "flex", }}>
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            width={matches ? "26" : "48"}
            height={matches ? "26" : "48"}
            viewBox="0 0 24 24"
            fill="#F2BC41"
            style={{ marginRight: i < 4 ? 2 : 0 }}
          >
            <path d="M12 .587l3.668 7.424 8.204 1.192-5.954 5.803 1.405 8.169L12 18.896l-7.323 3.854 1.405-8.169-5.954-5.803 8.204-1.192L12 .587z" />
          </svg>
        ))}
      </div> */}

      {/* Stars 2*/}
      <div style={{ display: "flex" }}>
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} style={{ marginRight: i < 4 ? 2 : 0 }}>{FullStar}</span>
        ))}
        {hasHalfStar && <span key="half" style={{ marginRight: fullStars + 1 < 5 ? 2 : 0 }}>{HalfStar}</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} style={{ marginRight: fullStars + (hasHalfStar ? 1 : 0) + i < 4 ? 2 : 0 }}>{EmptyStar}</span>
        ))}
      </div>

      {/* Google Reviews Text */}
      <div style={{
        display: "flex", alignItems: "center",
        fontSize: isMax600 ? 20 : isMax768 ? 22 : isMax991 ? 22 : isMax1280 ? 26 : isMax1440 ? 29 : isMax1680? 30 : 35,
        fontWeight: 600,
        fontFamily: "Arial, sans- serif",
        textAlign: 'center',
        marginTop: matches ? "2px" : '2px',
        letterSpacing: '0px'

      }}>
        <span style={{ color: "#4285F4" }}>G</span>
        <span style={{ color: "#EA4335" }}>o</span>
        <span style={{ color: "#FBBC05" }}>o</span>
        <span style={{ color: "#4285F4" }}>g</span>
        <span style={{ color: "#34A853" }}>l</span>
        <span style={{ color: "#EA4335" }}>e</span>
        <span style={{
          color: "#222", marginLeft: matches ? 3 : 8, fontWeight: 600,
          letterSpacing: '-2px'

        }}>Reviews</span>
      </div>
    </div >
  );
}