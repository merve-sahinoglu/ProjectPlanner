import React, { useEffect, useMemo } from "react";
import type { ICellRendererParams } from "ag-grid-community";
import { Avatar } from "@mantine/core";

interface PictureRendererProps extends ICellRendererParams {
  /** Etiketi row.data[labelField]'den al */
  labelField?: string;
  /** MIME tipi row.data[mimeTypeField]'den al (örn "image/png") */
  mimeTypeField?: string;
  /** MIME alanı yoksa kullanılacak varsayılan */
  defaultMime?: string;
}

const TRANSPARENT_PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottQAAAABJRU5ErkJggg==";

function pickLabel(row: any, f?: string) {
  return f ? row?.[f] ?? "" : "";
}
function pickMime(row: any, f?: string, def = "image/jpeg") {
  if (!f) return def;
  const v = row?.[f];
  if (!v) return def;
  if (typeof v === "string" && v.includes("/")) return v;
  if (typeof v === "object")
    return (v as any).mime || (v as any).type || (v as any).mimeType || def;
  return def;
}

function normalizeDataUrl(raw: string, mime = "image/jpeg"): string {
  const s = String(raw).trim();

  // Zaten http(s)/blob ise bırak
  if (/^(https?:|blob:)/i.test(s)) return s;

  // Doğru data: header'ı varsa olduğu gibi dön
  if (/^data:[^,]+,/.test(s)) return s;

  // Yanlış "data:/9j..." gelmişse → "data:<mime>;base64,<base64>"
  if (s.startsWith("data:/")) {
    return `data:${mime};base64,${s.slice(5)}`; // "data:".length === 5
  }

  // İçindeki gerçek base64’i yakala (en az 20 karakter)
  const m = s.match(/([A-Za-z0-9+/=]{20,})/);
  if (m) return `data:${mime};base64,${m[1]}`;

  // Son çare: base64 gibi davran
  return `data:${mime};base64,${s}`;
}


function toBlobUrlFromBytes(value: any, mime: string): string | null {
  try {
    let u8: Uint8Array | null = null;
    if (Array.isArray(value)) u8 = new Uint8Array(value); // number[]
    else if (value instanceof Uint8Array) u8 = value; // Uint8Array
    else if (value instanceof ArrayBuffer) u8 = new Uint8Array(value); // ArrayBuffer

    if (!u8) return null;

    // --> TypeScript'i ve runtime'ı memnun eden "gerçek" ArrayBuffer
    const ab: ArrayBuffer = (() => {
      // view tam buffer'ı kapsamıyorsa doğru slice'ı al
      const buf = u8.buffer as ArrayBuffer; // DOM tarafında gerçekten ArrayBuffer
      if (u8.byteOffset === 0 && u8.byteLength === buf.byteLength) return buf;
      const copy = new ArrayBuffer(u8.byteLength);
      new Uint8Array(copy).set(u8);
      return copy;
    })();

    const blob = new Blob([ab], { type: mime || "image/jpeg" });
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
}


const PictureRenderer: React.FC<PictureRendererProps> = (props) => {
  const { data, value, labelField, mimeTypeField, defaultMime } = props;

  const label = useMemo(() => pickLabel(data, labelField), [data, labelField]);
  const mime = useMemo(
    () => pickMime(data, mimeTypeField, defaultMime ?? "image/jpeg"),
    [data, mimeTypeField, defaultMime]
  );

  const src = useMemo(() => {
    let v: any = value;

    // Bazı backend'ler objeyle sarar
    if (v && typeof v === "object" && !Array.isArray(v)) {
      v = v.base64 ?? v.data ?? v.src ?? v.bytes ?? v;
    }
    // 1) raw byte → blob URL
    const blobUrl = toBlobUrlFromBytes(v, mime);
    if (blobUrl) return blobUrl;

    // 2) base64 / data-url → normalize
    if (typeof v === "string") {
      const dataUrl = normalizeDataUrl(v, mime);
      if (dataUrl) return dataUrl;
    }

    // 3) fallback
    return TRANSPARENT_PNG;
  }, [value, mime]);

  // blob URL ise cleanup
  useEffect(() => {
    return () => {
      if (src && src.startsWith("blob:")) URL.revokeObjectURL(src);
    };
  }, [src]);

  return (
    <div
      className="ag-picture-renderer"
      style={{ display: "flex", alignItems: "center", gap: 8 }}
    >
      <Avatar
        alt={label}
        src={src}
        onError={(e) =>
          ((e.currentTarget as HTMLImageElement).src = TRANSPARENT_PNG)
        }
      />
      <span
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {label}
      </span>
    </div>
  );
};

export default PictureRenderer;
