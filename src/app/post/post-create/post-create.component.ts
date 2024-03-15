import { Component, EventEmitter, Output } from "@angular/core";
import { Post } from "../post.model";  
import { NgForm } from "@angular/forms";
import { PostService } from "../posts.service"; 

@Component({
    selector:'app-post-create',
    templateUrl:'./post-create.component.html',
    styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent{
    enteredTitle = '';
    enteredContent = '';
    @Output() postCreated = new EventEmitter<Post>();

    constructor(private postService: PostService) {} 

    onAddPost(form: NgForm){
        if (form.invalid){
            return;
        }
        const post: Post = {
            _id: form.value.id,
            title: form.value.title,
            content: form.value.content,
        };
        this.postService.addPost(post._id, post.title, post.content)
        form.resetForm();
    }
}