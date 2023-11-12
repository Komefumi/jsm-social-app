import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signinValidation } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { useToast } from "@/components/ui/use-toast";
import { useUserSignIn } from "@/lib/react-query/queries-and-mutations";
import { useAuthStore } from "@/lib/state";

type Type__SigninValidation = z.infer<typeof signinValidation>;

const fieldToData: Record<keyof Type__SigninValidation, [label: string]> = {
  email: ["Email"],
  password: ["Password"],
};

const orderedFieldNames: (keyof Type__SigninValidation)[] = [
  "email",
  "password",
];

export default () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // const { mutateAsync: createUserAccount, isPending: isCreatingUser } =
  // useCreateUserAccount();
  const { mutateAsync: signInAccount, isPaused: isLoggingIn } = useUserSignIn();
  const { checkAuthUser } = useAuthStore();
  console.log({ checkAuthUser: checkAuthUser.toString() });

  const form = useForm<z.infer<typeof signinValidation>>({
    resolver: zodResolver(signinValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signinValidation>) {
    const authResult = await checkAuthUser();
    console.log({ authResult });
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    const session = await signInAccount({ ...values });

    if (!session) {
      console.log("no session");
      toast({
        title: "Sign In Failed",
        description: "Please try to log in with your new credentials",
        // variant: "destructive",
      });
      return;
    }

    toast({
      title: "Successfully Logged In",
    });
    navigate("/");
    /*
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
    */
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
            const [label] = fieldToData[fieldName];
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
                        type={fieldName === "email" ? "email" : "password"}
                        className="shad-input"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          })}

          <Button className="shad-button__primary" type="submit">
            {isLoggingIn ? (
              <div className="flex-center gap-2">
                <Loader />
              </div>
            ) : (
              "Login"
            )}
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2">
            Don't have an account?
            <Link
              className="text-primary-500 text-small-semibold ml-1"
              to="/auth/sign-up"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};
