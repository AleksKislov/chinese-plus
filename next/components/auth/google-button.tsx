"use client";
import Link from "next/link";
import { getBaseUrl } from "../../helpers/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useState, useEffect } from "react";

export default function GoogleButton() {
  const [baseUrl, setBaseUrl] = useState("https://www.chineseplus.club");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(getBaseUrl(window.location.href));
    }
  });

  return (
    <Link href={`${baseUrl}/api/auth/google`} className='btn btn-success btn-block mb-2'>
      Via Google <FontAwesomeIcon icon={faGoogle} />
    </Link>
  );
}
