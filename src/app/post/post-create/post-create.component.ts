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
    enteredImageUrl = ''; 
    uploadedImageUrl: string = '';

    @Output() postCreated = new EventEmitter<Post>();

    constructor(private postService: PostService) {} 
    
    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e: any) => {
                    this.uploadedImageUrl = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        }
    }
    
    onAddPost(form: NgForm) {
        if (form.invalid) {
            return;
        }
        const title = form.value.title;
        const content = form.value.content;
        let imageUrl = form.value.imageUrl;
        if (this.uploadedImageUrl) {
            imageUrl = this.uploadedImageUrl;
        }
        this.postService.addPost(title, content, imageUrl)
            form.resetForm();
    
            this.uploadedImageUrl = '';
        };
    }

    
