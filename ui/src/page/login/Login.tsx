// src/pages/LoginPage.tsx
import { useState } from "react";
import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Text,
  Group,
  Stack,
  Alert,
  LoadingOverlay,
  Divider,
  Anchor,
  Box,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAlertTriangle, IconArrowRight, IconFaceId } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useAuthenticationContext } from "../../authentication/AuthenticationContext";
import KIDS_IMG from "../../assets/images.jpeg";
import { AuthenticationRequest } from "../../authentication/types/authentication-types";

export default function Login() {
  const auth = useAuthenticationContext();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<AuthenticationRequest>({
    initialValues: {
      username: "",
      password: "",
    },
    validate: {
      username: (v) => (v.trim().length === 0 ? "Kullanıcı adı gerekli" : null),
      password: (v) => (v.trim().length < 4 ? "Şifre en az 4 karakter" : null),
    },
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
    debugger;

      const isAuthenticated = await auth.authenticateUser(form.values);

      if (isAuthenticated) {
        navigate(`/appointment/${auth.currentUser?.userId}`, { replace: true });
      } else {
        setError("Kullanıcı adı veya şifre hatalı.");
      }
    } catch (e) {
      setError("Giriş sırasında bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="main"
      mih="100dvh"
      style={{
        display: "grid",
        placeItems: "center", // <— tam ortalama
        position: "relative",
        overflow: "hidden",
        padding: "clamp(12px, 2vw, 24px)",
      }}
    >
      {/* Arka plan: pastel konfeti + bulutlar */}
      <DecorBG />

      <Paper
        withBorder
        shadow="xl"
        radius="xl"
        p="xl"
        style={{
          width: "min(1100px, 100%)", // <— responsive genişlik
          margin: 0, // <— auto gerek yok, grid merkezliyor
          position: "relative",
          zIndex: 1, // <— arka plandaki bulutların üstünde
          backdropFilter: "blur(10px)",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.75), rgba(255,255,255,0.55))",
        }}
        data-mantine-color-scheme-dark={
          {
            background:
              "linear-gradient(135deg, rgba(20,20,26,0.55), rgba(20,20,26,0.35))",
          } as any
        }
      >
        <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />

        <Box
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr",
            gap: "32px",
          }}
        >
          <Stack p={{ base: "sm", md: "lg" }} gap="md" justify="center">
            <Polaroid imageUrl={KIDS_IMG} />
          </Stack>

          {/* SAĞ: Form */}
          <Box p={{ base: "sm", md: "lg" }}>
            {error && (
              <Alert
                icon={<IconAlertTriangle size={16} />}
                color="red"
                mb="md"
                variant="light"
                title="Giriş başarısız"
                radius="md"
              >
                {error}
              </Alert>
            )}

            <Stack gap="md">
              <TextInput
                size="lg"
                radius="md"
                label="Kullanıcı adı"
                placeholder="xxx.xxx"
                withAsterisk
                leftSection={<IconFaceId size={18} />}
                {...form.getInputProps("username")}
              />
              <PasswordInput
                size="lg"
                radius="md"
                label="Şifre"
                placeholder="••••••••"
                withAsterisk
                {...form.getInputProps("password")}
              />
              <Group justify="end">
                <Anchor size="sm" onClick={(e) => e.preventDefault()}>
                  Şifremi unuttum
                </Anchor>
              </Group>

              <Group grow mt="xs">
                <Button
                  type="submit"
                  size="lg"
                  radius="md"
                  rightSection={<IconArrowRight size={18} />}
                  variant="gradient"
                  gradient={{ from: "pink", to: "violet" }}
                  onClick={handleSubmit}
                >
                  Giriş yap
                </Button>
              </Group>
              <Divider label="veya" labelPosition="center" my="sm" />
              <Text c="dimmed" size="sm">
                Sisteme erişim için yönetici ile iletişime geçin.
              </Text>
            </Stack>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

/* ----------------- Dekoratif Arkaplan ----------------- */
function DecorBG() {
  return (
    <>
      <div className="cloud c1" />
      <div className="cloud c2" />
      <div className="conf conf-1" />
      <div className="conf conf-2" />
      <div className="conf conf-3" />
      <style>{`
        .cloud {
          position: absolute;
          width: 280px; height: 120px;
          background: radial-gradient(closest-side, #ffffffaa, #ffffff00 70%);
          top: 8%; left: 6%;
          filter: blur(10px);
          border-radius: 50%;
          transform: translateZ(0);
        }
        .c2 { top: auto; bottom: 10%; left: auto; right: 8%; width: 320px }

        .conf {
          position: absolute;
          width: 14px; height: 14px;
          border-radius: 3px;
          opacity: .7;
          animation: fall 14s linear infinite;
        }
        .conf-1 { left: 12%; top: -20px; background: #ffd166; animation-delay: 0s; }
        .conf-2 { left: 48%; top: -40px; background: #ef476f; animation-delay: 4s; }
        .conf-3 { left: 78%; top: -30px; background: #06d6a0; animation-delay: 8s; }
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(120vh) rotate(370deg); }
        }

        @media (max-width: 992px) {
          .cloud { display: none; }
          .conf { display: none; }
        }
      `}</style>
    </>
  );
}

/* ----------------- Polaroid Bileşeni ----------------- */
function Polaroid({
  imageUrl,
  caption,
}: {
  imageUrl: string;
  caption?: string;
}) {
  return (
    <Box style={{ width: "min(360px, 100%)" }}>
      <div className="polaroid">
        <img
          src={imageUrl}
          alt={caption || "children"}
          referrerPolicy="no-referrer"
          onError={(e) => {
            // CORS/erişim hatasında basit bir fallback
            (e.currentTarget as HTMLImageElement).src =
              "data:image/svg+xml;utf8," +
              encodeURIComponent(
                `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'>
                   <rect width='100%' height='100%' fill='#f6f6f9'/>
                   <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#999' font-size='16' font-family='sans-serif'>
                     Görsel yüklenemedi
                   </text>
                 </svg>`
              );
          }}
        />
        {caption && <div className="cap">{caption}</div>}
      </div>

      <style>{`
        .polaroid {
          position: relative;
          background: #fff;
          padding: 14px 14px 50px;
          border-radius: 10px;
          box-shadow: 0 18px 60px rgba(0,0,0,0.15);
          transform: rotate(-2.5deg);
          width: 100%;
          max-width: 360px;
          margin-top: 8px;
        }
        .polaroid::before {
          /* Washi tape efekti */
          content: "";
          position: absolute;
          top: -14px; left: 50%;
          transform: translateX(-50%) rotate(-3deg);
          width: 120px; height: 24px;
          background: repeating-linear-gradient(
            45deg,
            #ffd6e7, #ffd6e7 8px,
            #d6f7ff 8px, #d6f7ff 16px
          );
          border-radius: 6px;
          opacity: .85;
          box-shadow: 0 6px 16px rgba(0,0,0,0.1);
        }
        .polaroid img {
          display: block;
          width: 100%;
          height: auto;
          border-radius: 8px;
          object-fit: cover;
          image-rendering: auto;
        }
        .polaroid .cap {
          position: absolute;
          bottom: 10px; left: 0; right: 0;
          text-align: center;
          font-weight: 700;
          color: #7c3aed;
        }

        [data-mantine-color-scheme="dark"] .polaroid {
          background: #1f1f25;
        }
      `}</style>
    </Box>
  );
}