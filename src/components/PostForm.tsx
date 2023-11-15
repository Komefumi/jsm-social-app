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
import FileUploader from "./shared/FileUploader";
import { INewPost, IPostCommon, IUpdatePost } from "@/lib/types";
import { useAuthStore } from "@/lib/state";
import { useToast } from "./ui/use-toast";
import { useCreatePost } from "@/lib/react-query/queries-and-mutations";

type Type__CreatePostValidation = z.infer<typeof createPostValidation>;

const fieldToData: Record<
  keyof Type__CreatePostValidation,
  [label: string, description?: string, options?: { placeholder: string }]
> = {
  caption: ["Caption", undefined],
  file: ["Add Photos", undefined],
  location: ["Location", "Add Location"],
  tags: [
    "Tags",
    'Add tags (separated by comma ",")',
    { placeholder: "Art, Expression, Learning" },
  ],
};

const orderedFieldNames: (keyof Type__CreatePostValidation)[] = [
  "caption",
  "file",
  "location",
  "tags",
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
  file: ({ post, field }) => {
    console.log({ fieldForFile: field });
    return (
      <FileUploader
        fieldChange={field.onChange}
        mediaURL={(post as IUpdatePost)?.imageURL}
      />
    );
  },
  location: ({ field }) => (
    <Input type="text" className="shad-input" {...field} />
  ),
  tags: ({ field }) => (
    <Input
      type="text"
      className="shad-input"
      placeholder={fieldToData["tags"][2]?.placeholder}
      {...field}
    />
  ),
};

interface Props {
  post?: IPostCommon;
}

export default ({ post }: Props) => {
  const navigate = useNavigate();
  const { mutateAsync: createPost } = useCreatePost();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof createPostValidation>>({
    resolver: zodResolver(createPostValidation),
    defaultValues: {
      caption: post?.caption || "",
      file: [],
      location: post?.location || "",
      tags: post?.tags || "",
    },
  });

  async function onSubmit(values: z.infer<typeof createPostValidation>) {
    // const authResult = await checkAuthUser();
    console.log("in onSubmit");
    console.log({ values });
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
