// src/utils/geo.js

export const isLocationInIndonesia = (lokasi) => {
  const { lat, lng } = lokasi;

  // 1. KOTAK BESAR UTAMA INDONESIA
  const isInsideMainBox = lat >= -11 && lat <= 6.5 && lng >= 95 && lng <= 141;
  if (!isInsideMainBox) return false;

  // =========================================================================
  // 🛡️ ZONA EXCLUSION (Penyaring Negara Tetangga yang Numpang di Kotak RI)
  // =========================================================================

  // ❌ Exclusion A: Malaysia Barat, Singapura, & Thailand Selatan
  const isInsideWestMalaysiaSingapore = 
    lat >= 1.15 && lat <= 6.5 && 
    lng >= 99.5 && lng <= 104.5;

  // ❌ Exclusion B: Wilayah Johor Malaysia
  const isInsideJohorArea = 
    lat >= 1.25 && lat <= 1.8 && 
    lng >= 102.8 && lng <= 104.2;

  // ❌ Exclusion C: Negara BRUNEI DARUSSALAM (Tambahan Baru 🇧🇳)
  const isInsideBrunei = 
    lat >= 4.0 && lat <= 5.1 &&     // Rentang lintang Brunei
    lng >= 114.0 && lng <= 115.5;   // Rentang bujur Brunei


  // 🚀 LOGIKA AKHIR
  // Harus masuk kotak Indonesia, TAPI tidak boleh di Malaysia, SG, maupun Brunei
  const isValidIndonesiaLocation = 
    isInsideMainBox && 
    !isInsideWestMalaysiaSingapore && 
    !isInsideJohorArea &&
    !isInsideBrunei; // <-- Filter Brunei aktif!

  return isValidIndonesiaLocation;
}