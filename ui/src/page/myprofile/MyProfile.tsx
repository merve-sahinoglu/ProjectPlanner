// src/features/profile/MyProfile.tsx
import {
  Grid,
  Group,
  PasswordInput,
  Select,
  Text,
  TextInput,
  Avatar,
  Divider,
  LoadingOverlay,
  ActionIcon,
  Badge,
  rem,
  Tooltip,
  Box,
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import styles from "./MyProfile.module.css"; // proje içindeki mevcut input sınıfları
import { useTranslation } from "react-i18next";
import Dictionary from "../../constants/dictionary";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import toast from "react-hot-toast";
import { createJsonPatchDocumentFromDirtyForm } from "../../services/json-patch-handler/json-patch-document";
import { apiUrl, createRequestUrl } from "../../config/app.config";
import RequestType from "../../enum/request-type";
import { nameof } from "../../helpers/name-of";
import useRequestHandler from "../../hooks/useRequestHandler";
import { DateInput } from "@mantine/dates";
import { useAuthenticationContext } from "../../authentication/AuthenticationContext";
import { UserResponse, UserRowProps } from "../user/props/UserTypes";
import { IconCamera, IconDeviceFloppy, IconEdit, IconX } from "@tabler/icons-react";

const genders = [
  { value: "0", label: "Unknown" },
  { value: "1", label: "Male" },
  { value: "2", label: "Female" },
  { value: "3", label: "Other" },
];

const schema = z.object({
  userName: z
    .string()
    .min(1, { message: " " + String(Dictionary.User.Validation.USERNAME_MIN) })
    .max(16, {
      message: " " + String(Dictionary.User.Validation.USERNAME_MAX),
    }),
  name: z
    .string()
    .min(1, { message: " " + String(Dictionary.User.Validation.NAME_MIN) })
    .max(128, { message: " " + String(Dictionary.User.Validation.NAME_MAX) }),
  surname: z
    .string()
    .min(1, { message: " " + String(Dictionary.User.Validation.SURNAME_MIN) })
    .max(128, {
      message: " " + String(Dictionary.User.Validation.SURNAME_MAX),
    }),
  title: z
    .string()
    .min(1, { message: " " + String(Dictionary.User.Validation.TITLE_MIN) })
    .max(128, { message: " " + String(Dictionary.User.Validation.TITLE_MAX) })
    .optional()
    .or(z.literal("").transform(() => undefined)),
  gender: z
    .string()
    .min(1, { message: " " + String(Dictionary.User.Validation.GENDER_MIN) }),
});

function base64ToBlob(
  base64: string,
  mimeType: "image/jpeg" | "image/png"
): File | null {
  if (!base64) return null;
  const base64Data = base64.split(",")[1] || base64;
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++)
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });
  return new File(
    [blob],
    `avatar.${mimeType === "image/png" ? "png" : "jpeg"}`,
    { type: mimeType }
  );
}

function base64ToByteArray(base64String: string): number[] {
  const cleaned = base64String.includes(",")
    ? base64String.split(",")[1]
    : base64String;
  const bin = atob(cleaned);
  return Array.from(bin, (ch) => ch.charCodeAt(0));
}

const readFileAsBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.readAsDataURL(file);
    r.onloadend = () =>
      r.result
        ? resolve(String(r.result).split(",")[1]!)
        : reject(new Error("read error"));
    r.onerror = () => reject(new Error("read error"));
  });

export default function MyProfile() {
  const { t } = useTranslation();
  const { fetchData, sendData } = useRequestHandler();
  const { currentUser } = useAuthenticationContext();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);

  // Boş form default’u (sunucu gelmeden önce)
  const empty: UserRowProps = {
    id: "",
    userName: "",
    email: "",
    password: null,
    cardNumber: null,
    searchText: "",
    name: "",
    surname: "",
    birthDate: null,
    gender: "",
    isActive: true,
    relativeId: "",
    typeId: "0",
    // opsiyonel alanlar varsa ekleyin
  };

  const form = useForm<UserRowProps>({
    initialValues: empty,
    validate: zodResolver(schema),
  });

  const initialValues = useRef<UserRowProps>(form.values);


   const fetchItems = async () => {
     const userId = currentUser?.userId;
      setLoading(true);
      const res = await fetchData<UserResponse>(
        createRequestUrl(apiUrl.userUrl, userId)
      );
      if (!res.isSuccess) {
        setLoading(false);
        toast.error(res.error || "Kullanıcı bilgileri alınamadı.");
        return;
      }

      const v = res.value;
      const mapped: UserRowProps = {
        ...v,
        id: v.id,
        userName: v.userName,
        email: v.email ?? "",
        password: null, // güvenlik gereği boş getiriyoruz
        cardNumber: v.cardNumber ?? null,
        searchText: v.searchText ?? "",
        name: v.name ?? "",
        surname: v.surname ?? "",
        birthDate: v.birthDate ? new Date(v.birthDate) : null,
        gender: String(v.gender ?? ""),
        isActive: v.isActive,
        relativeId: v.relativeId ?? "",
        typeId: String(v.typeId ?? "0"),
        // backend’den base64 gelirse file’a çevir
        profilePicture: v.profilePicture
          ? base64ToBlob(v.profilePicture as unknown as string, "image/jpeg")
          : undefined,
      };

      initialValues.current = mapped;
      form.setValues(mapped);
      form.resetDirty();
      setPreview(
        mapped.profilePicture instanceof File
          ? URL.createObjectURL(mapped.profilePicture)
          : null
      );
      setLoading(false);

   }
  // Profilimi getir
  useEffect(() => {
    const userId = currentUser?.userId;
    if (!userId) {
      setLoading(false);
      toast.error("Kullanıcı bulunamadı.");
      return;
    }
      fetchItems();

  }, []);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    form.validate();
    if (!form.isValid() || !form.values.id) return;

    const patch = createJsonPatchDocumentFromDirtyForm<UserRowProps>(
      form,
      form.values,
      ["profilePicture"]
    );

    if (
      form.isDirty("profilePicture") &&
      form.values.profilePicture instanceof File
    ) {
      const base64 = await readFileAsBase64(form.values.profilePicture);
      const picture = {
        op: "replace",
        path: "/profilePicture",
        value: base64ToByteArray(base64), // Binary olarak saklamak istersen
      };

      patch.push(picture);
    }

    if (patch.length === 0) {
      toast("Değişiklik yok.");
      return;
    }

    const resp = await sendData(
      createRequestUrl(apiUrl.userUrl, form.values.id),
      RequestType.Patch,
      patch
    );

    debugger;
    if (resp.isSuccess) {
      initialValues.current = form.values;
      form.resetDirty();
      setDisabled(true);
      toast.success(t(Dictionary.Success.POSITIVE) as string);
    } else {
      toast.error(resp.error);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    setDisabled(false);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    form.setValues(initialValues.current);
    setDisabled(true);
    // preview’ı geri al
    const pic = initialValues.current.profilePicture;
    setPreview(pic instanceof File ? URL.createObjectURL(pic) : null);
  };

 return (
   <Box className={styles.wrapperFluid} pos="relative">
     <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />

     {/* HERO / HEADER */}
     <div className={styles.header}>
       <div className={styles.hero}>
         <div className={styles.avatarWrap}>
           <Avatar src={preview ?? undefined} size={96} radius="xl" />
           <Tooltip
             label={disabled ? "Düzenle ile etkinleştir" : "Fotoğraf değiştir"}
           >
             <ActionIcon
               className={styles.cam}
               variant="filled"
               radius="xl"
               size="md"
               onClick={() => !disabled && fileRef.current?.click()}
               aria-label="change photo"
             >
               <IconCamera size={16} />
             </ActionIcon>
           </Tooltip>
           <input
             ref={fileRef}
             type="file"
             accept="image/jpeg,image/png"
             style={{ display: "none" }}
             onChange={(e) => {
               const file = e.target.files?.[0];
               form.setFieldValue("profilePicture", file ?? undefined);
               if (file) {
                 const r = new FileReader();
                 r.onload = () => setPreview(r.result as string);
                 r.readAsDataURL(file);
               } else {
                 setPreview(null);
               }
             }}
           />
         </div>

         <div className={styles.idBlock}>
           <Group gap="xs" wrap="wrap">
             <Text fw={800} fz={rem(22)} className={styles.titleText}>
               {form.values.name} {form.values.surname}
             </Text>
             <Badge
               variant="light"
               color={form.values.isActive ? "teal" : "gray"}
               size="sm"
             >
               {form.values.isActive ? "Active" : "Inactive"}
             </Badge>
           </Group>
           <Text fz="sm" className={styles.subText}>
             @{form.values.userName || "username"}
           </Text>
         </div>

         <div className={styles.headerActions}>
           <Group gap="xs">
             {disabled ? (
               <ActionIcon
                 variant="light"
                 size="lg"
                 onClick={handleEdit}
                 aria-label="edit"
               >
                 <IconEdit size={18} />
               </ActionIcon>
             ) : (
               <>
                 <ActionIcon
                   color="red"
                   variant="light"
                   size="lg"
                   onClick={handleCancel}
                   aria-label="cancel"
                 >
                   <IconX size={18} />
                 </ActionIcon>
                 <ActionIcon
                   color="grape"
                   variant="filled"
                   size="lg"
                   onClick={handleSave}
                   aria-label="save"
                 >
                   <IconDeviceFloppy size={18} />
                 </ActionIcon>
               </>
             )}
           </Group>
         </div>
       </div>
     </div>

     {/* CONTENT */}
     <div className={styles.section}>
       <Text fw={700} fz="sm">
         {t(Dictionary.User.TITLE)}
       </Text>
       <Divider my="sm" />

       <Grid gutter="md">
         <Grid.Col span={{ base: 12, md: 6 }}>
           <TextInput
             disabled={disabled}
             label={t(Dictionary.User.USERNAME)}
             {...form.getInputProps(nameof<UserRowProps>("userName"))}
           />
         </Grid.Col>

         <Grid.Col span={{ base: 12, md: 6 }}>
           <PasswordInput
             disabled={disabled}
             label={t(Dictionary.Login.PASSWORD)}
             {...form.getInputProps(nameof<UserRowProps>("password"))}
           />
         </Grid.Col>

         <Grid.Col span={{ base: 12, md: 6 }}>
           <TextInput
             disabled={disabled}
             label={t(Dictionary.User.NAME)}
             {...form.getInputProps(nameof<UserRowProps>("name"))}
           />
         </Grid.Col>

         <Grid.Col span={{ base: 12, md: 6 }}>
           <TextInput
             disabled={disabled}
             label={t(Dictionary.User.SURNAME)}
             {...form.getInputProps(nameof<UserRowProps>("surname"))}
           />
         </Grid.Col>

         <Grid.Col span={{ base: 12, md: 6 }}>
           <DateInput
             disabled={disabled}
             label={t(Dictionary.User.BIRTH_DATE)}
             {...form.getInputProps(nameof<UserRowProps>("birthDate"))}
           />
         </Grid.Col>

         <Grid.Col span={{ base: 12, md: 6 }}>
           <Select
             disabled={disabled}
             {...form.getInputProps(nameof<UserRowProps>("gender"))}
             label={t(Dictionary.User.GENDER)}
             data={genders}
           />
         </Grid.Col>
         <Grid.Col span={{ base: 12, md: 6 }}>
           <TextInput
             //   className={fieldStyles.input}
             disabled={disabled}
             label={t(Dictionary.User.EMAIL)}
             {...form.getInputProps(nameof<UserRowProps>("email"))}
           />
         </Grid.Col>
       </Grid>
     </div>
   </Box>
 );
}
