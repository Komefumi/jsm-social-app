import { ControllerRenderProps, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { createPostValidation } from "@/lib/validation";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { IPostCommon } from "@/lib/types";
import { useAuthStore } from "@/lib/state";
import { useToast } from "./ui/use-toast";
import { useCreatePost } from "@/lib/react-query/queries-and-mutations";

type Type__CreatePostValidation = z.infer<typeof createPostValidation>;

const fieldToData: Record<
  keyof Type__CreatePostValidation,
  [label: string, description?: string, options?: { placeholder: string }]
> = {
  caption: ["Caption", undefined],
  imageURL: ["Photo URL", undefined],
  location: ["Location", "Add Location"],
};

const orderedFieldNames: (keyof Type__CreatePostValidation)[] = [
  "caption",
  "imageURL",
  "location",
];

const fieldToRendering: Record<
  keyof Type__CreatePostValidation,
  (props: { field: ControllerRenderProps; post?: IPostCommon }) => JSX.Element
> = {
  caption: ({ field }) => (
    <Textarea
      className="shad-textarea custom-scrollbar resize-none"
      {...field}
    />
  ),
  imageURL: ({ field }) => {
    console.log({ fieldForFile: field });
    return <Input type="url" className="shad-input" {...field} />;
  },
  location: ({ field }) => (
    <Input type="text" className="shad-input" {...field} />
  ),
};

interface Props {
  post?: IPostCommon;
}

export default ({ post }: Props) => {
  const navigate = useNavigate();
  const { mutateAsync: createPost } = useCreatePost();
  const { user, token } = useAuthStore();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof createPostValidation>>({
    resolver: zodResolver(createPostValidation),
    defaultValues: {
      caption: post?.caption || "",
      imageURL: undefined,
      location: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof createPostValidation>) {
    // const authResult = await checkAuthUser();
    console.log("in onSubmit");
    console.log({ values });
    await createPost({ ...values, userID: user.id, token: token || "" });
    toast({ title: "Post successfully made!" });
    navigate("/");
    // const fileContent = await values.file!.text();
    // values.file?.stream().pipeTo(base64.encode)
    // console.log({ fileContent });
    // const base64Encoded = base64.encode(fileContent);
    // console.log({ base64Encoded });
    // const base64 = btoa(unescape(encodeURIComponent(fileContent)));
    // console.log({ base64 });
    /*
    console.log("did we get here?");
    const newPost = await createPost({
      ...values,
      userID: user.id,
    } as INewPost);

    if (!newPost) {
      toast({ title: "Please try again" });
      return;
    }

    navigate("/");
    */
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-9 w-full max-w-5xl"
      >
        {orderedFieldNames.map((fieldName) => {
          const FormInputRendering = fieldToRendering[fieldName];
          const [label, description] = fieldToData[fieldName];
          return (
            <FormField
              key={fieldName}
              control={form.control}
              name={fieldName}
              render={({ field }) => {
                console.log({ field });
                return (
                  <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                      <FormInputRendering
                        field={field as unknown as ControllerRenderProps}
                        post={post}
                      />
                    </FormControl>
                    {description && (
                      <FormDescription>{description}</FormDescription>
                    )}
                    <FormMessage className="shad-form__message" />
                  </FormItem>
                );
              }}
            />
          );
        })}
        <div className="flex gap-4 items-center justify-end">
          <Button className="shad-button__dark_4" type="button">
            Cancel
          </Button>
          <Button
            className="shad-button__primary whitespace-nowrap"
            type="submit"
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};
