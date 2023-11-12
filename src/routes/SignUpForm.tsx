import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signupValidation } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { useToast } from "@/components/ui/use-toast";
import {
  useCreateUserAccount,
  useUserSignIn,
} from "@/lib/react-query/queries-and-mutations";
import { useAuthStore } from "@/lib/state";

type Type__SignupValidation = z.infer<typeof signupValidation>;

const fieldToData: Record<
  keyof Type__SignupValidation,
  [label: string, desc: string]
> = {
  name: ["Name", "This is your public name"],
  username: ["Username", "This welcome your username"],
  email: ["Email", "Email to register using"],
  password: ["Password", "Enter a strong password"],
  passwordConfirmation: ["Confirm Password", "Confirm Password"],
};

const orderedFieldNames: (keyof Type__SignupValidation)[] = [
  "name",
  "username",
  "email",
  "password",
  "passwordConfirmation",
];

const passwordFieldNames: (keyof Type__SignupValidation)[] = [
  "password",
  "passwordConfirmation",
];

export default () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { mutateAsync: createUserAccount, isPending: isCreatingUser } =
    useCreateUserAccount();
  const { mutateAsync: signInAccount } = useUserSignIn();
  const { checkAuthUser } = useAuthStore();
  console.log({ checkAuthUser: checkAuthUser.toString() });

  const form = useForm<z.infer<typeof signupValidation>>({
    resolver: zodResolver(signupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signupValidation>) {
    const authResult = await checkAuthUser();
    console.log({ authResult });
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    const newUser = await createUserAccount(values);
    if (!newUser) {
      toast({
        title: "User Registration Failed",
        description: "For some reason creation of user account failed",
        variant: "destructive",
      });
      return;
    }

    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });

    if (!session) {
      console.log("no session");
      toast({
        title: "Sign In Failed",
        description: "Please try to log in with your new credentials",
        // variant: "destructive",
      });
    }

    console.log(JSON.stringify(checkAuthUser, null, 2));
    const isLoggedIn = await checkAuthUser();
    console.log({ isLoggedIn });
    if (isLoggedIn) {
      form.reset();
      console.log("navigating from SignUpForm");
      navigate("/");
    } else {
      console.log("failed check auth");
      // await deleteUser(newUser.$id);
      toast({
        title: "Sign In Failed",
        description: "Please try to log in with your new credentials",
        // variant: "destructive",
      });
    }
    // console.log({ newUser });
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="logo" />

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Create a new Account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          To use JSM Social, please enter your details
        </p>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          {orderedFieldNames.map((fieldName) => {
            const [label, desc] = fieldToData[fieldName];
            return (
              <FormField
                key={fieldName}
                control={form.control}
                name={fieldName}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                      <Input
                        type={
                          passwordFieldNames.includes(fieldName)
                            ? "password"
                            : fieldName === "email"
                            ? "email"
                            : "text"
                        }
                        className="shad-input"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>{desc}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          })}

          <Button className="shad-button__primary" type="submit">
            {isCreatingUser ? (
              <div className="flex-center gap-2">
                <Loader />
              </div>
            ) : (
              "Sign Up"
            )}
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account?
            <Link
              className="text-primary-500 text-small-semibold ml-1"
              to="/auth/sign-in"
            >
              Log In
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};
