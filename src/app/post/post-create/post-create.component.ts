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

    constructor(private postService: PostService) {} // Inject the PostService

    onAddPost(form: NgForm){
        if (form.invalid){
            return;
        }
        const post: Post = {
            title: form.value.title,
            content: form.value.content,
        };
        this.postService.addPost(post.title, post.content)
        form.resetForm();
    }
}