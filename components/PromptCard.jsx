"use client";

import { useState } from "react"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { usePathname, useRouter} from "next/navigation"
import HeartSvg from "./svgs/HeartSvg";

const PromptCard = ({post, handleTagClick, handleEdit, handleDelete}) => {
  
  const { data: session } = useSession();
  const pathName = usePathname();
  const router = useRouter();

  const [copied, setCopied] = useState("")
  const [like, setLike] = useState(post.likes? post.likes : 0);
  //const [postWithLikes, setPostWithLikes] = useState("")

  const handleCopy =() => {
    setCopied(post.prompt);
    navigator.clipboard.writeText(post.prompt);
    setTimeout(()=> setCopied(""), 3000);
  }

  const handleUserProfile = () => {
    console.log(post);
    if(post.creator._id === session?.user.id) return router.push("/profile");

    router.push(`/profile/${post.creator._id}?name=${post.creator.username}`);
  };
  

  const handleLike = () => {

    //setLike(prevLike => prevLike + 1);
    const newLikeCount = like + 1;
    setLike(newLikeCount);
    updateLike(newLikeCount);
    //updateLike(like);
  }

  const updateLike = async (like) => {

    
    console.log({
            type: 'this is PromptCard',
            prompt: post.prompt,
            userId: session?.user.id,
            tag: post.tag,
            postId: post._id,
            likes: like 
        });
    //save on the database
    try{
            const response = await fetch(`/api/prompt/${post._id}`,
            {
                method: 'PATCH',
                body: JSON.stringify({
                    prompt: post.prompt,
                    tag: post.tag,
                    likes: like
                })
            })
            if(response.ok){
                //router.push('/');
            }
        }catch(error){
            console.log(error);
        }
  }

  return (
    <div className="prompt_card">
      <div className="flex justify-between items-start gap-5">
        <div 
        className="flex-1 flex justify-start items-center gap-3 cursor-pointer"
        onClick={handleUserProfile}
        >
          <Image
          src={post.creator.image}
          alt="user_image"
          width={40}
          height={40}
          className="rounded-full object-contain"
          />  
          <div className="flex flex-col">
            <h3 className='font-satoshi font-semibold text-gray-900'>{post.creator.username}</h3>
            {/* <p className="font-inter text-sm text-gray-500">{post.creator.email}</p> */}
          </div>
        </div>

        <div className="copy_btn" onClick={handleCopy}>
         
          <Image
            src={copied=== post.promt
            ? '/assets/icons/tick.svg'
            : '/assets/icons/copy.svg'
          }
          alt={copied === post.prompt? "tick_icon": "copy_icon"}
          width={12}
          height={12}

          />
        </div>
 
      </div>  
      <p className="my-4 font-satoshi text-sm text-gray-700">{post.prompt}</p>
      <div className="flex justify-between" >
        <p 
          className="font-inter text-sm blue_gradient cursor-pointer"
          onClick={()=>handleTagClick && handleTagClick(post.tag)}
          >#{post.tag}
        </p>
        <div className="flex items-center">
          <HeartSvg 
          className="text-fuchsia-600 hover:text-purple-500 cursor-pointer"
          onClick={handleLike}/>
          <p className="text-sm ml-1">{like}</p>
        </div>
        
      </div>
      {session?.user.id === post.creator._id && pathName === "/profile" && (
        <div className="mt-5 flex-center gap-4 border-t border-gray-100 pt-3">
          <p className="font-inter text-sm gree_gradient cursor-pointer"
            onClick={handleEdit}>
              Edit
          </p>
          <p className="font-inter text-sm fuchsia_gradient cursor-pointer"
            onClick={handleDelete}>
              Delete
          </p>
        </div>
      )} 
      

    </div>
  )
}

export default PromptCard