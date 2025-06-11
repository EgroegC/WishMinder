import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { type FieldValues, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from '../ui/button';
import { DialogClose } from '../ui/dialog';

const oneYearAgo = new Date();
oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

const schema = z
    .object({
        name: z
            .string()
            .transform((val) => val?.trim() === "" ? undefined : val.trim())
            .optional()
            .refine((val) => !val || val.length >= 3, {
                message: "Name must be at least 3 characters.",
            }),

        surname: z
            .string()
            .transform((val) => val?.trim() === "" ? undefined : val.trim())
            .optional()
            .refine((val) => !val || val.length >= 3, {
                message: "Surname must be at least 3 characters.",
            }),

        email: z
            .string()
            .transform((val) => (val === "" ? undefined : val))
            .optional()
            .refine((val) => !val || val.length >= 12, {
                message: "Email must be at least 12 characters.",
            })
            .refine((val) => !val || val.length <= 255, {
                message: "Email must be no more than 255 characters.",
            })
            .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
                message: "Must be a valid email.",
            }),

        phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, {
            message:
                "Phone number must be a valid format (e.g., +123456789 or 1234567890).",
        }),

        birthdate: z
            .string()
            .transform((val) => (val === "" ? undefined : val))
            .optional()
            .refine((date) => !date || new Date(date) <= new Date(), {
                message: "Birthdate cannot be in the future.",
            })
            .refine((date) => !date || new Date(date) <= oneYearAgo, {
                message: "The birthdate should be at least one year ago.",
            }),
    })
    .refine((data) => !!(data.name?.trim() || data.surname?.trim()), {
        message: "Either name or surname is required.",
        path: ["name"],
    });

interface Props {
    onFormSubmit: (data: FieldValues) => void;
    defaultValues?: {
        name: string;
        surname: string;
        email: string;
        phone: string;
        birthdate?: string;
    };
}

const ContactForm = ({
    onFormSubmit,
    defaultValues,
}: Props) => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: zodResolver(schema), defaultValues });

    return (
        <form onSubmit={handleSubmit(onFormSubmit)}>
            <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            placeholder="Name *"
                            {...register("name")}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="surname">Surname</Label>
                        <Input
                            placeholder="Surname *"
                            {...register("surname")}
                        />
                        {errors.surname && (
                            <p className="text-sm text-red-500">{errors.surname.message}</p>
                        )}
                    </div>
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                        placeholder="Phone *"
                        {...register("phone")}
                    />
                    {errors.phone && (
                        <p className="text-sm text-red-500">{errors.phone.message}</p>
                    )}
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="email">email</Label>
                    <Input
                        placeholder="Email"
                        {...register("email")}
                    />
                    {errors.email && (
                        <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="birthdate">Birthdate</Label>
                    <Input
                        type="date"
                        {...register("birthdate")}
                    />
                    {errors.birthdate && (
                        <p className="text-sm text-red-500">{errors.birthdate.message}</p>
                    )}
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <DialogClose asChild>
                        <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Save</Button>
                </div>
            </div>
        </form>
    )
}

export default ContactForm